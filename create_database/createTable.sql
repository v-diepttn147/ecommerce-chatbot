-- Table: public.thuvienbk_book
-- DROP TABLE public.thuvienbk_book CASCADE;

CREATE TABLE public.thuvienbk_book
(
    id integer NOT NULL ,
    title character varying(100) COLLATE pg_catalog."default" NOT NULL,
    language character varying(50) COLLATE pg_catalog."default" NOT NULL,
    publisher_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    published_year integer NOT NULL,
    "ISBN" bigint NOT NULL,
    price double precision NOT NULL,
    rating_point double precision NOT NULL,
    num_of_rates integer NOT NULL,
    in_stocks integer NOT NULL,
    sales_volume integer NOT NULL,
    CONSTRAINT thuvienbk_book_pkey PRIMARY KEY (id),
    CONSTRAINT "thuvienbk_book_ISBN_key" UNIQUE ("ISBN")
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_book
    OWNER to postgres;


-- Table: public.thuvienbk_bookauthor
-- DROP TABLE public.thuvienbk_bookauthor CASCADE;

CREATE TABLE public.thuvienbk_bookauthor
(
    id integer NOT NULL ,
    author_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT thuvienbk_bookauthor_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_bookauthor
    OWNER to postgres;


-- Table: public.thuvienbk_bookcategory
-- DROP TABLE public.thuvienbk_bookcategory CASCADE;

CREATE TABLE public.thuvienbk_bookcategory
(
    id integer NOT NULL ,
    category_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT thuvienbk_bookcategory_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_bookcategory
    OWNER to postgres;


-- Table: public.thuvienbk_book_authors
-- DROP TABLE public.thuvienbk_book_authors;

CREATE TABLE public.thuvienbk_book_authors
(
    id integer NOT NULL ,
    book_id integer NOT NULL,
    bookauthor_id integer NOT NULL,
    CONSTRAINT thuvienbk_book_authors_pkey PRIMARY KEY (id),
    CONSTRAINT thuvienbk_book_authors_book_id_bookauthor_id_13214399_uniq UNIQUE (book_id, bookauthor_id),
    CONSTRAINT thuvienbk_book_autho_bookauthor_id_5ada1f80_fk_thuvienbk FOREIGN KEY (bookauthor_id)
        REFERENCES public.thuvienbk_bookauthor (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT thuvienbk_book_authors_book_id_cccb7099_fk_thuvienbk_book_id FOREIGN KEY (book_id)
        REFERENCES public.thuvienbk_book (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_book_authors
    OWNER to postgres;


-- Index: thuvienbk_book_authors_book_id_cccb7099
-- DROP INDEX public.thuvienbk_book_authors_book_id_cccb7099;

CREATE INDEX thuvienbk_book_authors_book_id_cccb7099
    ON public.thuvienbk_book_authors USING btree
    (book_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Index: thuvienbk_book_authors_bookauthor_id_5ada1f80
-- DROP INDEX public.thuvienbk_book_authors_bookauthor_id_5ada1f80;

CREATE INDEX thuvienbk_book_authors_bookauthor_id_5ada1f80
    ON public.thuvienbk_book_authors USING btree
    (bookauthor_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.thuvienbk_book_categories
-- DROP TABLE public.thuvienbk_book_categories;

CREATE TABLE public.thuvienbk_book_categories
(
    id integer NOT NULL ,
    book_id integer NOT NULL,
    bookcategory_id integer NOT NULL,
    CONSTRAINT thuvienbk_book_categories_pkey PRIMARY KEY (id),
    CONSTRAINT thuvienbk_book_categories_book_id_bookcategory_id_e55b7280_uniq UNIQUE (book_id, bookcategory_id),
    CONSTRAINT thuvienbk_book_categ_bookcategory_id_2ac0b909_fk_thuvienbk FOREIGN KEY (bookcategory_id)
        REFERENCES public.thuvienbk_bookcategory (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED,
    CONSTRAINT thuvienbk_book_categories_book_id_394ae973_fk_thuvienbk_book_id FOREIGN KEY (book_id)
        REFERENCES public.thuvienbk_book (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_book_categories
    OWNER to postgres;


-- Index: thuvienbk_book_categories_book_id_394ae973
-- DROP INDEX public.thuvienbk_book_categories_book_id_394ae973;

CREATE INDEX thuvienbk_book_categories_book_id_394ae973
    ON public.thuvienbk_book_categories USING btree
    (book_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Index: thuvienbk_book_categories_bookcategory_id_2ac0b909
-- DROP INDEX public.thuvienbk_book_categories_bookcategory_id_2ac0b909;

CREATE INDEX thuvienbk_book_categories_bookcategory_id_2ac0b909
    ON public.thuvienbk_book_categories USING btree
    (bookcategory_id ASC NULLS LAST)
    TABLESPACE pg_default;


-- Table: public.key_book 
-- DROP TABLE public.key_book CASCADE;

CREATE TABLE public.key_table
(
    id INTEGER NOT NULL,
    "ISBN" bigint NOT NULL,
    key128 character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT key_table_pkey PRIMARY KEY (id),
    CONSTRAINT key_table_key_fk FOREIGN KEY ("ISBN")
        REFERENCES public.thuvienbk_book ("ISBN") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        DEFERRABLE INITIALLY DEFERRED
)

TABLESPACE pg_default;

ALTER TABLE public.thuvienbk_book_categories
    OWNER to postgres;
