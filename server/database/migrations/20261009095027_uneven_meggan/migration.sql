CREATE TYPE "puzzle_difficulty" AS ENUM('normal', 'hard');--> statement-breakpoint
CREATE TYPE "puzzle_publication_status" AS ENUM('draft', 'published', 'unpublished');--> statement-breakpoint
CREATE TYPE "puzzle_solver_method" AS ENUM('simple', 'four');--> statement-breakpoint
CREATE TYPE "puzzle_type" AS ENUM('system', 'daily', 'community');--> statement-breakpoint
CREATE TYPE "puzzle_validation_status" AS ENUM('pending', 'valid', 'invalid');--> statement-breakpoint
CREATE TABLE "puzzles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "puzzles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(128) NOT NULL,
	"type" "puzzle_type" NOT NULL,
	"height" smallint NOT NULL,
	"width" smallint NOT NULL,
	"row_clues" jsonb NOT NULL,
	"column_clues" jsonb NOT NULL,
	"solution_bits" text NOT NULL,
	"solution_hash" text NOT NULL,
	"difficulty" "puzzle_difficulty",
	"solver_method" "puzzle_solver_method",
	"simple_solver_sweep_count" integer,
	"four_solver_intersection_count" integer,
	"filled_cell_count" smallint GENERATED ALWAYS AS (length(replace("solution_bits", '0', ''))) STORED,
	"publication_status" "puzzle_publication_status" DEFAULT 'draft'::"puzzle_publication_status" NOT NULL,
	"validation_status" "puzzle_validation_status" DEFAULT 'pending'::"puzzle_validation_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "slug_format" CHECK ("slug" ~* '^[a-z0-9]([a-z0-9_-]*[a-z0-9])?$'),
	CONSTRAINT "slug_min_length" CHECK (char_length("slug") >= 3),
	CONSTRAINT "height_range" CHECK ("height" BETWEEN 5 AND 30),
	CONSTRAINT "width_range" CHECK ("width" BETWEEN 5 AND 30),
	CONSTRAINT "solution_length" CHECK (length("solution_bits") = "height" * "width"),
	CONSTRAINT "binary_solution" CHECK ("solution_bits" ~ '^[01]+$'),
	CONSTRAINT "row_clues_array" CHECK (jsonb_typeof("row_clues") = 'array'),
	CONSTRAINT "column_clues_array" CHECK (jsonb_typeof("column_clues") = 'array'),
	CONSTRAINT "clue_dimensions" CHECK (jsonb_array_length("row_clues") = "height" AND jsonb_array_length("column_clues") = "width"),
	CONSTRAINT "difficulty_solver_consistency" CHECK (
    ("difficulty" IS NULL AND "solver_method" IS NULL)
    OR (
      "difficulty" IS NOT NULL
      AND "solver_method" IS NOT NULL
      AND (
        ("difficulty" = 'normal' AND "solver_method" = 'simple')
        OR ("difficulty" = 'hard' AND "solver_method" = 'four')
      )
    )
  ),
	CONSTRAINT "simple_solver_sweep_count_nonnegative" CHECK ("simple_solver_sweep_count" >= 0),
	CONSTRAINT "four_solver_intersection_count_nonnegative" CHECK ("four_solver_intersection_count" >= 0),
	CONSTRAINT "published_puzzle_valid" CHECK ("publication_status" <> 'published' OR "validation_status" = 'valid'),
	CONSTRAINT "solver_sweep_intersection_consistency" CHECK (
    "solver_method" IS NULL
    OR (
      "solver_method" = 'simple'
      AND "simple_solver_sweep_count" > 0
      AND "four_solver_intersection_count" = 0
    )
    OR (
      "solver_method" = 'four'
      AND "simple_solver_sweep_count" >= 0
      AND "four_solver_intersection_count" > 0
    )
  ),
	CONSTRAINT "validation_solver_consistency" CHECK (
    (
      "validation_status" <> 'valid'
      AND "difficulty" IS NULL
      AND "solver_method" IS NULL
      AND "simple_solver_sweep_count" IS NULL
      AND "four_solver_intersection_count" IS NULL
    )
    OR (
      "validation_status" = 'valid'
      AND "difficulty" IS NOT NULL
      AND "solver_method" IS NOT NULL
      AND "simple_solver_sweep_count" IS NOT NULL
      AND "four_solver_intersection_count" IS NOT NULL
    )
  )
);
--> statement-breakpoint
CREATE UNIQUE INDEX "puzzles_slug_unique" ON "puzzles" (lower("slug"));--> statement-breakpoint
CREATE UNIQUE INDEX "puzzles_system_puzzle_solution_unique" ON "puzzles" ("height","width","solution_hash") WHERE "type" = 'system';--> statement-breakpoint
CREATE INDEX "puzzles_selection_index" ON "puzzles" ("height","width","difficulty","id") WHERE 
    "type" = 'system' AND "publication_status" = 'published'
  ;