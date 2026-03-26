-- Federation schema migration
-- Creates all tables needed for ActivityPub federation, instance mirroring, and hub federation

DO $$ BEGIN CREATE TYPE mirror_status AS ENUM ('pending','active','paused','failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE mirror_direction AS ENUM ('pull','push'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS federated_content (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  object_uri text NOT NULL UNIQUE,
  actor_uri text NOT NULL,
  remote_actor_id uuid REFERENCES remote_actors(id) ON DELETE SET NULL,
  origin_domain varchar(255) NOT NULL,
  ap_type varchar(32) NOT NULL,
  title text, content text, summary text, url text, cover_image_url text,
  tags jsonb DEFAULT '[]', attachments jsonb DEFAULT '[]',
  in_reply_to text, cpub_type varchar(32), cpub_metadata jsonb,
  local_like_count int DEFAULT 0 NOT NULL, local_comment_count int DEFAULT 0 NOT NULL,
  published_at timestamptz, received_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL, deleted_at timestamptz,
  mirror_id uuid, is_hidden boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS instance_mirrors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  remote_domain varchar(255) NOT NULL UNIQUE, remote_actor_uri text NOT NULL,
  status mirror_status DEFAULT 'pending' NOT NULL, direction mirror_direction NOT NULL,
  filter_content_types jsonb, filter_tags jsonb,
  content_count int DEFAULT 0 NOT NULL, error_count int DEFAULT 0 NOT NULL,
  last_error text, last_sync_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS hub_actor_keypairs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id uuid NOT NULL REFERENCES hubs(id) ON DELETE CASCADE UNIQUE,
  public_key_pem text NOT NULL, private_key_pem text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS hub_followers_fed (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hub_id uuid NOT NULL REFERENCES hubs(id) ON DELETE CASCADE,
  follower_actor_uri text NOT NULL, activity_uri text,
  status follow_relationship_status DEFAULT 'pending' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL, updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(hub_id, follower_actor_uri)
);

ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS shared_inbox text;
ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS summary text;
ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS follower_count int;
ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS following_count int;
ALTER TABLE remote_actors ADD COLUMN IF NOT EXISTS actor_type varchar(32) DEFAULT 'Person' NOT NULL;
ALTER TABLE follow_relationships ADD COLUMN IF NOT EXISTS activity_uri text;
