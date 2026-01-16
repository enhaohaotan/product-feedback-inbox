create table feedbacks (
	id uuid primary key default gen_random_uuid(),
	title text not null,
	message text not null,
	category text not null
		check (category in ('bug', 'feature', 'billing', 'other')),
	email text not null unique,
	priority text not null
		CHECK (priority IN ('low', 'medium', 'high')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);