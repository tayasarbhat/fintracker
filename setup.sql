-- Enable RLS and UUID extension
create extension if not exists "uuid-ossp";

-- Create tables in correct order
create table public.credit_debit_accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  phone_number text,
  email text,
  total_credit decimal(12,2) default 0 not null,
  total_debit decimal(12,2) default 0 not null,
  balance decimal(12,2) default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  amount decimal(12,2) not null,
  type text not null check (type in ('income', 'expense')),
  category_id text,
  subcategory_id text,
  payment_method text,
  notes text,
  related_account_id uuid references public.credit_debit_accounts(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.credit_debit_transactions (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references public.credit_debit_accounts(id) on delete cascade not null,
  amount decimal(12,2) not null,
  type text not null check (type in ('credit', 'debit')),
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null,
  status text not null check (status in ('pending', 'settled')),
  settled_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.transactions enable row level security;
alter table public.credit_debit_accounts enable row level security;
alter table public.credit_debit_transactions enable row level security;

-- Create RLS policies
create policy "Users can view their own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
  on public.transactions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
  on public.transactions for delete
  using (auth.uid() = user_id);

create policy "Users can view their own accounts"
  on public.credit_debit_accounts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own accounts"
  on public.credit_debit_accounts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own accounts"
  on public.credit_debit_accounts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own accounts"
  on public.credit_debit_accounts for delete
  using (auth.uid() = user_id);

create policy "Users can view transactions for their accounts"
  on public.credit_debit_transactions for select
  using (
    exists (
      select 1 from public.credit_debit_accounts
      where id = credit_debit_transactions.account_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert transactions for their accounts"
  on public.credit_debit_transactions for insert
  with check (
    exists (
      select 1 from public.credit_debit_accounts
      where id = credit_debit_transactions.account_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update transactions for their accounts"
  on public.credit_debit_transactions for update
  using (
    exists (
      select 1 from public.credit_debit_accounts
      where id = credit_debit_transactions.account_id
      and user_id = auth.uid()
    )
  );

create policy "Users can delete transactions for their accounts"
  on public.credit_debit_transactions for delete
  using (
    exists (
      select 1 from public.credit_debit_accounts
      where id = credit_debit_transactions.account_id
      and user_id = auth.uid()
    )
  );

-- Create functions and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.transactions
  for each row
  execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.credit_debit_accounts
  for each row
  execute procedure public.handle_updated_at();

create trigger set_updated_at
  before update on public.credit_debit_transactions
  for each row
  execute procedure public.handle_updated_at();

-- Function to update account balances
create or replace function public.update_account_balance()
returns trigger as $$
begin
  if (tg_op = 'INSERT') then
    update public.credit_debit_accounts
    set
      total_credit = case when new.type = 'credit' then total_credit + new.amount else total_credit end,
      total_debit = case when new.type = 'debit' then total_debit + new.amount else total_debit end,
      balance = case
        when new.type = 'credit' then balance - new.amount
        else balance + new.amount
      end
    where id = new.account_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update public.credit_debit_accounts
    set
      total_credit = case when old.type = 'credit' then total_credit - old.amount else total_credit end,
      total_debit = case when old.type = 'debit' then total_debit - old.amount else total_debit end,
      balance = case
        when old.type = 'credit' then balance + old.amount
        else balance - old.amount
      end
    where id = old.account_id;
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

create trigger update_account_balance
  after insert or delete on public.credit_debit_transactions
  for each row
  execute procedure public.update_account_balance();