--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 17.0

-- Started on 2025-08-15 08:16:34

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 2846943)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 875 (class 1247 OID 2847018)
-- Name: activity_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activity_type_enum AS ENUM (
    'login',
    'challenge_start',
    'challenge_save',
    'challenge_submit',
    'logout',
    'timeout'
);


ALTER TYPE public.activity_type_enum OWNER TO postgres;

--
-- TOC entry 872 (class 1247 OID 2847010)
-- Name: audit_action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.audit_action_enum AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE'
);


ALTER TYPE public.audit_action_enum OWNER TO postgres;

--
-- TOC entry 857 (class 1247 OID 2846966)
-- Name: challenge_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.challenge_type AS ENUM (
    'code',
    'open-ended',
    'multiple-choice'
);


ALTER TYPE public.challenge_type OWNER TO postgres;

--
-- TOC entry 860 (class 1247 OID 2846974)
-- Name: difficulty_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.difficulty_type AS ENUM (
    'easy',
    'medium',
    'hard'
);


ALTER TYPE public.difficulty_type OWNER TO postgres;

--
-- TOC entry 863 (class 1247 OID 2846982)
-- Name: session_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.session_status AS ENUM (
    'started',
    'in_progress',
    'completed',
    'expired',
    'abandoned'
);


ALTER TYPE public.session_status OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 2847002)
-- Name: submission_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.submission_status_enum AS ENUM (
    'draft',
    'submitted',
    'graded'
);


ALTER TYPE public.submission_status_enum OWNER TO postgres;

--
-- TOC entry 866 (class 1247 OID 2846994)
-- Name: submission_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.submission_type_enum AS ENUM (
    'code',
    'open-ended',
    'multiple-choice'
);


ALTER TYPE public.submission_type_enum OWNER TO postgres;

--
-- TOC entry 234 (class 1255 OID 2846688)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 2847103)
-- Name: assessment_challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_challenges (
    id integer NOT NULL,
    assessment_id character varying(50) NOT NULL,
    challenge_id character varying(50) NOT NULL,
    display_order integer DEFAULT 0,
    is_required boolean DEFAULT true,
    weight numeric(5,2) DEFAULT 1.0
);


ALTER TABLE public.assessment_challenges OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 2847102)
-- Name: assessment_challenges_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.assessment_challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.assessment_challenges_id_seq OWNER TO postgres;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_challenges_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.assessment_challenges_id_seq OWNED BY public.assessment_challenges.id;


--
-- TOC entry 221 (class 1259 OID 2847132)
-- Name: assessment_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessment_sessions (
    id character varying(50) NOT NULL,
    assessment_id character varying(50) NOT NULL,
    candidate_id character varying(50) NOT NULL,
    status public.session_status DEFAULT 'started'::public.session_status,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed_at timestamp without time zone,
    expires_at timestamp without time zone,
    total_score numeric(5,2) DEFAULT NULL::numeric,
    passing_score numeric(5,2) DEFAULT NULL::numeric,
    is_passed boolean,
    session_token character varying(255) DEFAULT NULL::character varying,
    ip_address character varying(45) DEFAULT NULL::character varying,
    user_agent text
);


ALTER TABLE public.assessment_sessions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 2847295)
-- Name: assessment_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.assessment_summary AS
SELECT
    NULL::character varying(50) AS id,
    NULL::character varying(255) AS title,
    NULL::text AS description,
    NULL::character varying(100) AS created_by,
    NULL::timestamp without time zone AS created_at,
    NULL::timestamp without time zone AS updated_at,
    NULL::boolean AS is_active,
    NULL::integer AS time_limit_minutes,
    NULL::numeric(5,2) AS passing_score,
    NULL::text AS instructions,
    NULL::bigint AS total_challenges,
    NULL::bigint AS code_challenges,
    NULL::bigint AS open_ended_challenges,
    NULL::bigint AS multiple_choice_challenges;


ALTER VIEW public.assessment_summary OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 2847031)
-- Name: assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assessments (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    created_by character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    time_limit_minutes integer,
    passing_score numeric(5,2) DEFAULT NULL::numeric,
    instructions text
);


ALTER TABLE public.assessments OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 2847216)
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    id integer NOT NULL,
    table_name character varying(100) NOT NULL,
    record_id character varying(50) NOT NULL,
    action public.audit_action_enum NOT NULL,
    old_values json,
    new_values json,
    changed_by character varying(100) DEFAULT NULL::character varying,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address character varying(45) DEFAULT NULL::character varying
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 2847215)
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_log_id_seq OWNER TO postgres;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 227
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- TOC entry 220 (class 1259 OID 2847122)
-- Name: candidates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.candidates (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) DEFAULT NULL::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.candidates OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 2847055)
-- Name: challenge_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenge_files (
    id integer NOT NULL,
    challenge_id character varying(50) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_content text,
    language character varying(50),
    is_main_file boolean DEFAULT false,
    display_order integer DEFAULT 0
);


ALTER TABLE public.challenge_files OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 2847054)
-- Name: challenge_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challenge_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challenge_files_id_seq OWNER TO postgres;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 212
-- Name: challenge_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challenge_files_id_seq OWNED BY public.challenge_files.id;


--
-- TOC entry 222 (class 1259 OID 2847155)
-- Name: challenge_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenge_submissions (
    id character varying(50) NOT NULL,
    session_id character varying(50) NOT NULL,
    challenge_id character varying(50) NOT NULL,
    candidate_id character varying(50) NOT NULL,
    submission_type public.submission_type_enum NOT NULL,
    status public.submission_status_enum DEFAULT 'draft'::public.submission_status_enum,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    time_spent_seconds integer,
    score numeric(5,2) DEFAULT NULL::numeric,
    max_score numeric(5,2) DEFAULT NULL::numeric,
    is_auto_submitted boolean DEFAULT false,
    answer_text text,
    ai_feedback text,
    ai_detection_score integer,
    ai_detected boolean
);


ALTER TABLE public.challenge_submissions OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 2847042)
-- Name: challenges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challenges (
    id character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    type public.challenge_type NOT NULL,
    difficulty public.difficulty_type DEFAULT 'medium'::public.difficulty_type,
    time_limit_minutes integer,
    created_by character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true,
    instructions text,
    language character varying(50) DEFAULT NULL::character varying,
    initial_code text,
    test_cases json,
    acceptance_criteria text
);


ALTER TABLE public.challenges OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 2847183)
-- Name: code_submission_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.code_submission_files (
    id integer NOT NULL,
    submission_id character varying(50) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_content text,
    language character varying(50)
);


ALTER TABLE public.code_submission_files OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 2847182)
-- Name: code_submission_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.code_submission_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.code_submission_files_id_seq OWNER TO postgres;

--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 223
-- Name: code_submission_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.code_submission_files_id_seq OWNED BY public.code_submission_files.id;


--
-- TOC entry 226 (class 1259 OID 2847197)
-- Name: multiple_choice_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.multiple_choice_answers (
    id integer NOT NULL,
    submission_id character varying(50) NOT NULL,
    question_id integer NOT NULL,
    selected_option_id character(1) NOT NULL,
    is_correct boolean DEFAULT false,
    points_earned numeric(5,2) DEFAULT 0
);


ALTER TABLE public.multiple_choice_answers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 2847196)
-- Name: multiple_choice_answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.multiple_choice_answers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.multiple_choice_answers_id_seq OWNER TO postgres;

--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 225
-- Name: multiple_choice_answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.multiple_choice_answers_id_seq OWNED BY public.multiple_choice_answers.id;


--
-- TOC entry 217 (class 1259 OID 2847087)
-- Name: multiple_choice_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.multiple_choice_options (
    id integer NOT NULL,
    question_id integer NOT NULL,
    option_id character(1) NOT NULL,
    option_text text NOT NULL,
    is_correct boolean DEFAULT false,
    display_order integer DEFAULT 0
);


ALTER TABLE public.multiple_choice_options OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 2847086)
-- Name: multiple_choice_options_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.multiple_choice_options_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.multiple_choice_options_id_seq OWNER TO postgres;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 216
-- Name: multiple_choice_options_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.multiple_choice_options_id_seq OWNED BY public.multiple_choice_options.id;


--
-- TOC entry 215 (class 1259 OID 2847071)
-- Name: multiple_choice_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.multiple_choice_questions (
    id integer NOT NULL,
    challenge_id character varying(50) NOT NULL,
    question_text text NOT NULL,
    explanation text,
    display_order integer DEFAULT 0,
    points integer DEFAULT 1
);


ALTER TABLE public.multiple_choice_questions OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 2847070)
-- Name: multiple_choice_questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.multiple_choice_questions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.multiple_choice_questions_id_seq OWNER TO postgres;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 214
-- Name: multiple_choice_questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.multiple_choice_questions_id_seq OWNED BY public.multiple_choice_questions.id;


--
-- TOC entry 233 (class 1259 OID 2847305)
-- Name: multiple_choice_scores; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.multiple_choice_scores AS
SELECT
    NULL::character varying(50) AS submission_id,
    NULL::character varying(50) AS session_id,
    NULL::character varying(50) AS challenge_id,
    NULL::bigint AS total_questions,
    NULL::bigint AS correct_answers,
    NULL::numeric AS score_percentage,
    NULL::numeric AS total_points,
    NULL::bigint AS max_points;


ALTER VIEW public.multiple_choice_scores OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 2847228)
-- Name: session_activity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_activity (
    id integer NOT NULL,
    session_id character varying(50) NOT NULL,
    activity_type public.activity_type_enum NOT NULL,
    challenge_id character varying(50) DEFAULT NULL::character varying,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    details text,
    ip_address character varying(45) DEFAULT NULL::character varying,
    user_agent text
);


ALTER TABLE public.session_activity OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 2847227)
-- Name: session_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_activity_id_seq OWNER TO postgres;

--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 229
-- Name: session_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_activity_id_seq OWNED BY public.session_activity.id;


--
-- TOC entry 232 (class 1259 OID 2847300)
-- Name: session_progress; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.session_progress AS
SELECT
    NULL::character varying(50) AS id,
    NULL::character varying(50) AS assessment_id,
    NULL::character varying(50) AS candidate_id,
    NULL::public.session_status AS status,
    NULL::timestamp without time zone AS started_at,
    NULL::timestamp without time zone AS completed_at,
    NULL::timestamp without time zone AS expires_at,
    NULL::numeric(5,2) AS total_score,
    NULL::numeric(5,2) AS passing_score,
    NULL::boolean AS is_passed,
    NULL::character varying(255) AS session_token,
    NULL::character varying(45) AS ip_address,
    NULL::text AS user_agent,
    NULL::bigint AS total_submissions,
    NULL::bigint AS completed_challenges,
    NULL::bigint AS total_challenges,
    NULL::numeric AS completion_percentage,
    NULL::numeric AS average_score;


ALTER VIEW public.session_progress OWNER TO postgres;

--
-- TOC entry 3237 (class 2604 OID 2847106)
-- Name: assessment_challenges id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_challenges ALTER COLUMN id SET DEFAULT nextval('public.assessment_challenges_id_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 2847219)
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- TOC entry 3228 (class 2604 OID 2847058)
-- Name: challenge_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_files ALTER COLUMN id SET DEFAULT nextval('public.challenge_files_id_seq'::regclass);


--
-- TOC entry 3255 (class 2604 OID 2847186)
-- Name: code_submission_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_submission_files ALTER COLUMN id SET DEFAULT nextval('public.code_submission_files_id_seq'::regclass);


--
-- TOC entry 3256 (class 2604 OID 2847200)
-- Name: multiple_choice_answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_answers ALTER COLUMN id SET DEFAULT nextval('public.multiple_choice_answers_id_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 2847090)
-- Name: multiple_choice_options id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_options ALTER COLUMN id SET DEFAULT nextval('public.multiple_choice_options_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 2847074)
-- Name: multiple_choice_questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_questions ALTER COLUMN id SET DEFAULT nextval('public.multiple_choice_questions_id_seq'::regclass);


--
-- TOC entry 3263 (class 2604 OID 2847231)
-- Name: session_activity id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_activity ALTER COLUMN id SET DEFAULT nextval('public.session_activity_id_seq'::regclass);


--
-- TOC entry 3497 (class 0 OID 2847103)
-- Dependencies: 219
-- Data for Name: assessment_challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.assessment_challenges VALUES (1, 'assessment-frontend-2025', 'challenge-programming-fundamentals', 1, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (2, 'assessment-frontend-2025', 'challenge-frontend-architecture-2025', 2, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (3, 'assessment-frontend-2025', 'challenge-performance-optimization-2025', 3, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (5, 'assessment-frontend-2025', 'challenge-testing-code-quality-2025', 4, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (6, 'assessment-frontend-2025', 'challenge-security-resilience-2025', 5, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (7, 'assessment-backend-2025', 'challenge-programming-fundamentals-backend-2025', 1, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (8, 'assessment-backend-2025', 'challenge-architecture-design-backend-2025', 2, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (9, 'assessment-backend-2025', 'challenge-database-dynamic-pricing-2025', 3, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (10, 'assessment-backend-2025', 'challenge-testing-code-quality-2025', 4, true, 1.00);
INSERT INTO public.assessment_challenges VALUES (11, 'assessment-backend-2025', 'challenge-security-resilience-2025', 5, true, 1.00);


--
-- TOC entry 3499 (class 0 OID 2847132)
-- Dependencies: 221
-- Data for Name: assessment_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.assessment_sessions VALUES ('session-1755066867152', 'assessment-frontend-2025', 'candidate-1755066867152', 'started', '2025-08-13 06:34:27.152246', NULL, '2025-08-13 11:34:27.152246', NULL, NULL, NULL, '17837196-1afa-4281-9b24-6d61787d5262', NULL, NULL);
INSERT INTO public.assessment_sessions VALUES ('session-1755070747096', 'assessment-backend-2025', 'candidate-1755070747073', 'completed', '2025-08-13 07:39:07.104591', '2025-08-13 07:40:23.42237', '2025-08-13 12:39:07.104591', NULL, NULL, NULL, 'dfd37e2e-d9a7-4eaa-9e36-c06f8b8a9234', NULL, NULL);
INSERT INTO public.assessment_sessions VALUES ('session-1755058003054', 'assessment-frontend-2025', 'candidate-1755058003054', 'completed', '2025-08-13 04:06:43.054163', '2025-08-13 09:36:02.024444', '2025-08-14 09:06:43.054', NULL, NULL, NULL, '7034d024-40db-4146-82ce-a6a16d836d13', NULL, NULL);
INSERT INTO public.assessment_sessions VALUES ('session-1755135358459', 'assessment-frontend-2025', 'candidate-1755135358459', 'completed', '2025-08-14 01:35:58.459741', '2025-08-14 01:50:12.87135', '2025-08-14 06:35:58.459741', NULL, NULL, NULL, '26d8f29e-2220-4fb5-bc07-419f7245de3a', NULL, NULL);
INSERT INTO public.assessment_sessions VALUES ('session-1755137669225', 'assessment-frontend-2025', 'candidate-1755137669225', 'started', '2025-08-14 02:14:29.225343', NULL, '2025-08-14 07:14:29.225343', NULL, NULL, NULL, 'ca63bb0d-212c-4ec4-ad21-aaa1d2bfb4f0', NULL, NULL);


--
-- TOC entry 3488 (class 0 OID 2847031)
-- Dependencies: 210
-- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.assessments VALUES ('assessment-frontend-2025', 'Frontend Assessment 2025', 'Assessment frontend 2025: fokus pada fungsionalitas fetch data, search, pagination, dan cart.', 'tech-lead', '2025-08-12 14:36:36.47989', '2025-08-12 14:36:36.47989', true, 300, NULL, 'Ikuti instruksi di challenge terkait. Utamakan fungsionalitas, gunakan Hash Router.');
INSERT INTO public.assessments VALUES ('assessment-backend-2025', 'Backend Assessment 2025', 'Assessment backend 2025: fokus modul UserService dengan batch, uniqueness, retry, logging, dan design pattern.', 'tech-lead', '2025-08-12 15:14:45.305572', '2025-08-12 15:14:45.305572', true, 300, 70.00, 'Ikuti instruksi pada challenge terkait. Data in-memory, eksekusi via Main.java.');


--
-- TOC entry 3506 (class 0 OID 2847216)
-- Dependencies: 228
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3498 (class 0 OID 2847122)
-- Dependencies: 220
-- Data for Name: candidates; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.candidates VALUES ('candidate-1755058003054', 'Andrew Junior Ongi Karyanto', 'andrewjr3108@gmail.com', NULL, '2025-08-13 04:06:43.054072', '2025-08-13 04:06:43.054072');
INSERT INTO public.candidates VALUES ('candidate-1755066867152', 'Andrew Junior Ongi Karyanto', 'andrew@akarinti.tech', NULL, '2025-08-13 06:34:27.152187', '2025-08-13 06:34:27.152188');
INSERT INTO public.candidates VALUES ('candidate-1755070747073', 'John Doe', 'john@example.com', NULL, '2025-08-13 07:39:07.075316', '2025-08-13 07:39:07.075316');
INSERT INTO public.candidates VALUES ('candidate-1755073878688', 'Andrew Junior Ongi Karyanto', 'andrewjr3108@gmail.com', NULL, '2025-08-13 08:31:18.688926', '2025-08-13 08:31:18.688926');
INSERT INTO public.candidates VALUES ('candidate-1755077584319', 'Andrew Junior Ongi Karyanto', 'andrewjr3108@gmail.com', NULL, '2025-08-13 09:33:04.319616', '2025-08-13 09:33:04.319617');
INSERT INTO public.candidates VALUES ('candidate-1755077603650', 'Andrew Junior Ongi Karyanto', 'andrewjr3108@gmail.com', NULL, '2025-08-13 09:33:23.652176', '2025-08-13 09:33:23.652176');
INSERT INTO public.candidates VALUES ('candidate-1755135358459', 'Andrew Junior Ongi Karyanto', 'andrewjr3108@gmail.com', NULL, '2025-08-14 01:35:58.459657', '2025-08-14 01:35:58.459657');
INSERT INTO public.candidates VALUES ('candidate-1755137669225', 'Andrew Junior Ongi Karyanto', 'andrew@akarinti.tech', NULL, '2025-08-14 02:14:29.225296', '2025-08-14 02:14:29.225296');


--
-- TOC entry 3491 (class 0 OID 2847055)
-- Dependencies: 213
-- Data for Name: challenge_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.challenge_files VALUES (1, 'challenge-programming-fundamentals', 'README.md', '
## Petunjuk Pengerjaan

- Gunakan Hash Router.
- Struktur minimal: List/Table, Item, Search, Pagination, Cart.
- Pisahkan logic fetch (custom hook) dan UI.
- Tangani state: loading, error, empty.
- Simpan cart (context/store/localStorage).
- Tidak perlu styling detail.

**Hindari** commit kode placeholder di komponen utama.
', 'markdown', true, 1);
INSERT INTO public.challenge_files VALUES (2, 'challenge-programming-fundamentals-backend-2025', 'Main.java', '
import java.util.*;
import java.io.*;

class Main {

  public static String Foo(String param) {
    return param;
  }

  public static void main(String[] args) {
    // 1. Setup
    UserService userService = new UserService();

    // 2. Add single user tests
    // Contoh (isi sendiri saat implementasi):
    // userService.addUser(user1);
    // userService.addUser(user_invalid_email);

    // 3. Update single user tests
    // userService.updateUser(update_req_valid);

    // 4. Delete single user tests (soft delete)
    // userService.deleteUser(user2.email);

    // 5. Find user tests
    // userService.findUserByName("Ana");
    // userService.findUserByEmail(user1.email);

    // 6. Batch add test
    // userService.addUsers(batch_users);

    // 7. Batch update test
    // userService.updateUsers(batch_updates);

    // 8. Batch delete test
    // userService.deleteUsers(batch_delete_emails);
  }
}
', 'java', true, 1);


--
-- TOC entry 3500 (class 0 OID 2847155)
-- Dependencies: 222
-- Data for Name: challenge_submissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.challenge_submissions VALUES ('submission-1755066642217', 'session-1755058003054', 'challenge-testing-code-quality-2025', 'candidate-1755058003054', 'multiple-choice', 'submitted', '2025-08-13 06:30:42.217144', NULL, 8.00, 10.00, false, NULL, NULL, NULL, NULL);
INSERT INTO public.challenge_submissions VALUES ('submission-1755066671934', 'session-1755058003054', 'challenge-security-resilience-2025', 'candidate-1755058003054', 'multiple-choice', 'submitted', '2025-08-13 06:31:11.934818', NULL, 4.00, 10.00, false, NULL, NULL, NULL, NULL);
INSERT INTO public.challenge_submissions VALUES ('submission-1755070799572', 'session-1755070747096', 'challenge-architecture-design-backend-2025', 'candidate-1755070747073', 'open-ended', 'submitted', '2025-08-13 07:39:59.572396', 12300, NULL, 100.00, false, 'ini jawaban tes', NULL, NULL, NULL);
INSERT INTO public.challenge_submissions VALUES ('submission-1755136183787', 'session-1755135358459', 'challenge-testing-code-quality-2025', 'candidate-1755135358459', 'multiple-choice', 'submitted', '2025-08-14 01:49:43.78779', NULL, 7.00, 10.00, false, NULL, NULL, NULL, NULL);
INSERT INTO public.challenge_submissions VALUES ('submission-1755066395733', 'session-1755058003054', 'challenge-frontend-architecture-2025', 'candidate-1755058003054', 'open-ended', 'submitted', '2025-08-13 06:26:35.733531', NULL, 7.00, 100.00, false, '1) Struktur folder/file & komponen
Aku bayanginnya per modul punya folder sendiri biar tim bisa kerja paralel, plus ada shared buat hal umum.

```
src/
  app/
    router.tsx              // definisi route per modul
    layout.tsx              // layout umum (navbar/sidebar)
    providers.tsx           // context global (theme, auth)
  shared/
    components/             // komponen UI generik (Button, Input, Modal, Table)
      Button/
        Button.tsx
        index.ts
      Table/
        Table.tsx
        index.ts
    hooks/                  // hooks generik (useFetch, useDebounce)
      useFetch.ts
      useDebounce.ts
      index.ts
    utils/                  // helper (dateFormat, currency)
      currency.ts
      date.ts
      index.ts
    services/               // api client dasar
      http.ts               // fetch wrapper sederhana
      endpoints.ts          // konstanta endpoint
    styles/                 // style global (tailwind.css / tokens)
      tailwind.css
      tokens.css
    store/                  // state global ringan (Context+Reducer)
      authContext.tsx
      notificationContext.tsx
  modules/
    dashboard/
      pages/
        DashboardPage.tsx
      components/
        StatsCard.tsx
      hooks/
        useDashboardData.ts
      services/
        dashboard.api.ts     // call API khusus dashboard
      index.ts
    catalog/
      pages/
        ProductListPage.tsx
        ProductDetailPage.tsx
      components/
        ProductCard.tsx
        ProductFilter.tsx
      hooks/
        useProducts.ts
      services/
        catalog.api.ts
      index.ts
    users/
      pages/
        UserListPage.tsx
        UserDetailPage.tsx
      components/
        UserForm.tsx
      hooks/
        useUsers.ts
      services/
        users.api.ts
      index.ts
    notifications/
      pages/
        NotificationCenterPage.tsx
      components/
        NotificationItem.tsx
      hooks/
        useNotifications.ts
      services/
        notifications.api.ts
      index.ts
```
2) Pendekatan/pola yang kupakai & alasan
Feature-based (per modul)
Biar tiap tim megang folder sendiri (dashboard, catalog, users, notifications). Lebih gampang cari file.

Pisah UI vs logic ringan
components/ fokus tampilan, hooks/ buat ambil data/handle state lokal modul, services/ panggil API. Biar komponen gampang di-reuse.

Shared layer
shared/components, shared/hooks, shared/utils buat hal umum. Mengurangi duplikasi.

State global minimal
Aku pilih Context + Reducer dulu (buat auth, notif), karena lebih ringan. Kalau nanti butuh kompleks bisa pindah ke lib state lain (misal Zustand/Redux), tapi sementara ini cukup.

3) Strategi reusability (komponen, logic, style)
UI Kit sederhana di shared/components
Button, Input, Modal, Table—semua modul wajib pakai ini supaya look & feel sama.

Hooks generik di shared/hooks
useFetch, useDebounce, usePaginatedList (nanti kepakai di katalog & users).

Service dasar shared/services/http.ts
Satu pintu untuk fetch + interceptor sederhana (tambah header auth, handle error umum).

Style konsisten
Pakai Tailwind + tokens.css (spacing, warna, font) supaya konsisten. Kalau nggak Tailwind, bisa CSS Modules tapi aku pribadi lebih cepat Tailwind.

Index re-export
Tiap folder ada index.ts biar import-nya rapi: import { Button } from "@/shared/components".

4) Dokumentasi keputusan arsitektur (biar tim lain mudah adopsi)
/docs/architecture.md (singkat)

Kenapa feature-based

Aturan penamaan file/folder (kebab/pascal)

Cara nambah modul baru (template folder)

Kapan taruh di shared vs di modul', 'Strengths: struktur fold er yang jelas berbasis fitur, lapisan shared untuk reuse, pemisahan UI-logic, dan contoh struktur modul yang konkret. Weaknesses: belum ada analisis trade-off secara eksplisit (komponen 5), detail adopsi tim lintas modul sangat terbatas, dan dokumentasi governance/QA tidak dijabarkan. Suggestions: tambahkan bagian trade-off dengan alasan, jelaskan rencana onboarding tim, panduan code reviews/linting, versioning, serta contoh template README architecture.', 72, true);
INSERT INTO public.challenge_submissions VALUES ('submission-1755066572690', 'session-1755058003054', 'challenge-performance-optimization-2025', 'candidate-1755058003054', 'open-ended', 'submitted', '2025-08-13 06:29:32.690875', NULL, 6.00, 100.00, false, '1) Masalah utama yang bikin performa rendah (dugaan dari pola umum PSI)
Bundle JS kegedean & eksekusinya lama
Biasanya kelihatan di audit “Reduce JavaScript execution time / Remove unused JS”. React app sering kebanyakan library + tidak di-split.

Render-blocking resources (CSS/JS di <head>)
CSS/JS yang nggak di-defer bikin First Paint/LCP telat.

Gambar besar/tidak terkompres
LCP image sering belum dioptimasi (belum di-preload, format bukan modern seperti WebP/AVIF).

Font web lambat
Tanpa preload/font-display: swap, teks nunggu font (FOIT/FOUT).

Tidak lazy-load konten di bawah layar
Image/list panjang nge-load sekaligus.

Third-party script berat
Widget/analytics/ads yang banyak bisa nambah blocking & network cost.

Caching header kurang
Tanpa cache, aset ke-download ulang tiap kunjungan.

2) Langkah yang aku lakukan (step by step, yang sederhana dulu)
A. Aset & Network (quick wins)
Kompres & ubah format gambar → WebP/AVIF, atur dimensi pas kebutuhan.

Tools: imagemin/squoosh saat build.

Aktifkan lazy-load gambar (native)
Preload LCP image (yang di hero section)

B. JavaScript (kurangi beban)
Production build & minify (pastikan NODE_ENV=production).

Code splitting pakai React.lazy + Suspense untuk route/module besar:
Hapus/kurangi library berat (moment.js ganti dayjs, lodash pilih import-per-fungsi).

Defer non-critical script
D. React usage
Memoisasi komponen berat seperlunya:

E. Third-party
Audit & tunda third-party: load setelah load event atau on-interaction kalau bisa.

Gunakan async untuk script eksternal:', 'Strengths: Identifikasi masalah utama terkait PageSpeed Insights (bundle JS besar, render-blocking, gambar besar, font, lazy-load, third-party, caching) dan langkah konkrit (split/lazy-load, ganti library, defer script, optimasi gambar). Weaknesses: referensi metrik/Web Vitals kurang eksplisit; tanpa budget/threshold, tanpa monitoring/CI (Lighthouse CI), atau SOP tim. Suggestions: tetapkan budget (bundle <200KB, LCP <2.5s), implement Lighthouse CI, definisikan owner/PR SOP, ukur dampak.', 72, true);
INSERT INTO public.challenge_submissions VALUES ('submission-1755136207628', 'session-1755135358459', 'challenge-security-resilience-2025', 'candidate-1755135358459', 'multiple-choice', 'submitted', '2025-08-14 01:50:07.628433', NULL, 1.00, 10.00, false, NULL, NULL, NULL, NULL);
INSERT INTO public.challenge_submissions VALUES ('submission-1755135547805', 'session-1755135358459', 'challenge-frontend-architecture-2025', 'candidate-1755135358459', 'open-ended', 'submitted', '2025-08-14 01:39:07.805757', NULL, 5.00, 100.00, false, '1. Struktur Folder/File dan Komponen
Aku bakal bikin folder buat tiap-tiap modul. Jadi ada folder dashboard, katalog-produk, manajemen-user, sama notifikasi. Di dalam tiap folder modul itu, nanti ada folder lagi buat hal-hal kecilnya, kayak komponen-komponen spesifik buat modul itu aja.

Terus, aku bakal bikin folder terpisah di luar modul-modul tadi, namanya components atau shared. Isinya komponen-komponen yang bisa dipakai bareng-bareng di semua modul, contohnya tombol (Button), inputan (Input), atau layout dasar (Layout).

Terus, komponennya aku bikin jadi komponen-komponen kecil. Kayak misalnya, ada komponen buat kartu produk, itu isinya cuma gambar sama nama produk. Nanti di halaman katalog, kartu-kartu produk itu disusun jadi satu.

2. Pendekatan Arsitektur
Aku nggak terlalu ngerti istilah-istilah kayak atomic design gitu. Tapi kalau menurut aku, aku bakal pakai pendekatan modul per fitur. Jadi, satu fitur besar (misalnya dashboard) punya satu folder sendiri.

Kenapa? Soalnya di soal dibilang, tiap modul bisa dikerjain sama tim yang beda. Jadi, kalau semuanya ada di folder masing-masing, timnya nggak bingung. Mereka tinggal fokus di folder mereka aja, jadi nggak nabrak-nabrak kerjaan tim lain.

3. Strategi Komponen, Logic, dan Style yang Bisa Dipakai Ulang
Aku bakal taruh semua komponen yang bisa dipakai ulang di satu folder tadi, yang namanya shared atau components. Jadi, kalau butuh tombol, tinggal ambil dari sana aja.

Buat logic, aku mungkin bakal bikin file atau folder namanya helpers atau utils. Isinya fungsi-fungsi kecil yang bisa dipakai di mana aja, kayak fungsi buat format tanggal atau buat validasi.

Nah, buat style ini aku bingung. Mungkin pakai CSS biasa, tapi namanya harus unik banget biar nggak bentrok. Atau pakai library kayak Tailwind CSS biar semua tim pakai aturan yang sama.

4. Cara Mendokumentasikan Keputusan Arsitektur
Aku palingan cuma bikin file README.md di folder utama. Nanti aku tulis di situ:

Struktur foldernya kayak gimana.

Kenapa aku bagi foldernya per modul.

Dimana nyimpen komponen yang bisa dipakai ulang.

Contoh-contoh cara bikin komponen baru.

Aturan penamaan file dan variabel.

Pokoknya, yang penting tim lain bisa baca dan ngerti.', 'Strengths: Struktur modul berbasis fitur jelas; ada folder shared untuk reuse; konsep komponen reusable dan dokumentasi README sederhana. Weaknesses: detail struktur path belum konsisten (mis. src/modules/src/shared), pola arsitektur belum tegas dipilih (lebih ke ''modul per fitur'' tanpa pattern formal), tidak membahas trade-off atau governance skala besar, kurang eksplisit strategi reuse lintas tim, maupun panduan kolaborasi. Suggestions: tambahkan contoh struktur folder secara lengkap, tetapkan pattern (feature-based vs atomic), jelaskan trade-offs, buat template dokumentasi dan guidelines coding/style untuk tim.', 28, false);
INSERT INTO public.challenge_submissions VALUES ('submission-1755135606430', 'session-1755135358459', 'challenge-performance-optimization-2025', 'candidate-1755135358459', 'open-ended', 'submitted', '2025-08-14 01:40:06.430258', NULL, 6.00, 100.00, false, '. Masalah Utama
Aku lihat angkanya kok merah semua ya? Berarti jelek ya? Angka yang paling gede itu First Contentful Paint (FCP) sama Largest Contentful Paint (LCP). Itu kayaknya butuh waktu lama banget buat nampilin hal-hal pertama di layarnya. Mungkin gambarnya kegedean? Atau kodingan JavaScript-nya terlalu banyak pas awal-awal? Aku nggak tahu juga.

Terus, aku juga lihat ada tulisan Time to interactive (TTI). Itu juga merah. Berarti aplikasi ini lama banget bisa dipakai, harus nungguin loading dulu. Padahal cuma buat company profile kan? Harusnya nggak gitu.

Ada juga yang namanya Total Blocking Time. Itu kayaknya ada kodingan yang bikin aplikasi ini nge-hang sebentar, jadi nggak bisa diklik-klik gitu.

Intinya, aplikasi ini lambat banget buat dimuat, apalagi di HP.

2. Langkah-langkah untuk Optimasi
Kalau menurutku, karena masalahnya di kecepatan, yang pertama aku lakukan itu:

Cek Gambar. Aku yakin ini gambarnya kegedean banget. Aku bakal coba kecilin ukurannya, mungkin dikompres pakai web lain. Atau pakai format yang lebih kecil kayak webp.

Cek Kode JavaScript. Aku nggak tahu persis cara lihatnya, tapi mungkin ada kode-kode yang nggak kepakai tapi ikut dimuat di awal. Aku bakal coba cari cara buat ngilangin atau dipindahin ke tempat lain biar nggak langsung diload. Atau pakai yang namanya lazy loading gitu, biar kodenya dimuat kalau pas dibutuhkan aja.

Hapus Hal yang Nggak Penting. Mungkin ada library yang nggak dipakai tapi masih ada di kodenya? Aku bakal coba bersihin. Terus, kayaknya pakai CSS juga bisa dikurangin. Mungkin ada aturan-aturan CSS yang nggak dipakai.

Minify Files. Ini aku sering denger. Katanya kodingan bisa dikecilin ukurannya, biar lebih cepat. Aku bakal coba cari tools buat minify file CSS sama JavaScript-nya.', 'Strengths: Mengidentifikasi metric utama seperti FCP/LCP/TTI dan menyarankan optimasi gambar serta lazy loading.\nKelemahan: Analisis terlalu umum tanpa referensi angka dari laporan; tidak ada tolok ukur kinerja (budget) atau rencana mitigasi bertahap; bahasa informal; belum mengonsep pipeline/CI-CD.\nSaran: Kaitkan masalah ke data PageSpeed (mis. gambar besar, CSS/JS tak terpakai, bundle size). Tetapkan target Web Vitals (LCP <2.5s, TTI), buat rencana langkah-langkah bertahap (bundle analisis, code-splitting dengan React.lazy, preload/prefetch, image optimization), serta tambahkan monitoring dan SOP PR review.', 65, true);


--
-- TOC entry 3489 (class 0 OID 2847042)
-- Dependencies: 211
-- Data for Name: challenges; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.challenges VALUES ('challenge-frontend-architecture-2025', 'Software Architecture and Design', 'Exploratory answer about enterprise-grade frontend architecture: structure, patterns, reuse, docs, and trade-offs.', 'open-ended', 'medium', 45, 'tech-lead', '2025-08-12 14:37:07.107803', '2025-08-12 14:37:07.107803', true, '
Kamu ditunjuk untuk merancang frontend architecture pada aplikasi enterprise dengan fitur utama:
- Terdiri dari beberapa modul (dashboard, katalog produk, manajemen user, notifikasi)
- Tiap modul akan terus berkembang dan bisa dikerjakan tim berbeda
- Target: maintainable, scalable, dan konsisten dalam jangka panjang

Jawab secara eksploratif (plain text, bullet, atau pseudo-code, tidak perlu gambar):
1. Struktur folder/file dan komponen seperti apa yang akan kamu buat untuk mendukung skenario di atas?
2. Jelaskan pendekatan atau pola (pattern) arsitektur yang kamu gunakan dalam menyusun struktur folder/file, serta alasannya.
   - (Contoh: atomic design, feature-based, pemisahan UI dan logic, dsb. Jika belum familiar istilahnya, jelaskan saja cara dan logikamu membaginya.)
3. Bagaimana strategi-mu agar komponen, logic, dan style bisa reusable lintas modul/tim?
4. Bagaimana cara kamu mendokumentasikan keputusan arsitektur agar mudah diadopsi oleh tim lain?
5. Jelaskan 1 trade-off penting yang harus diputuskan dalam membangun arsitektur frontend berskala besar seperti ini.
', NULL, NULL, NULL, '
## Preliminary Checks (Mandatory - Fail Any = Score 0)
1. No AI-generated content indicators
2. Clear folder/file structure provided
3. No dummy or placeholder code
4. No hardcoded values in main components

If any preliminary check fails, score is automatically 0.

## Evaluation Criteria (Maximum 10 points)

### Score 1-2: Basic Structure Understanding
Key Indicators:
- Mentions basic folder/file structure (src/components, src/pages, modules)
- Provides minimal reasoning for structure choice (feature-based or component-based)

AI Detection Keywords: "src/components", "src/pages", "modules", basic folder mentions
Missing Elements: Hierarchy details, cross-module strategies, team collaboration

### Score 3-4: Organized Hierarchy with Patterns
Key Indicators:
- Clear hierarchy between folders with separation of components, hooks, services
- Identifies main pattern (feature-based, atomic design) with basic reasoning
- Focus remains on structural organization
- Does NOT discuss cross-module/team reuse strategies
- Does NOT address maintainability for large teams
- Does NOT mention team collaboration or adoption processes

AI Detection Keywords: "hierarchy", "separation", "hooks", "services", pattern names
Hard Boundary: Must NOT mention cross-team collaboration, reuse strategies, or adoption processes
Progression Markers: Organized structure, pattern awareness, separation of concerns
Still Missing: Team collaboration, reuse strategies, maintainability at scale

### Score 5-6: Cross-Module Reusability Strategy
Key Indicators:
- All Score 3-4 elements present
- Explains reuse strategy across modules (shared/components usable by different modules)
- Discusses structure adoption and maintenance by larger teams
- Mentions lightweight guidelines or inter-team communication
- Addresses how structure supports team collaboration

AI Detection Keywords: "reuse", "shared components", "cross-module", "team adoption", "maintainability"
Hard Boundary: Must include specific reuse strategies and team adoption considerations
Progression Markers: Multi-team awareness, component sharing, scalable structure
Still Missing: Detailed guidelines, trade-offs, advanced practices

### Score 7-8: Documentation and Trade-off Analysis
Key Indicators:
- All Score 5-6 elements present
- Provides documentation examples (README, style guides) or maintainability tips
- Explains important architectural trade-offs with reasoning
- Discusses team adoption and maintenance processes
- May include automation or code review considerations

AI Detection Keywords: "documentation", "README", "style guide", "trade-off", "automation", "code review"
Hard Boundary: Must include both documentation approach AND trade-off analysis
Progression Markers: Process documentation, decision rationale, maintenance automation
Still Missing: Advanced governance, proven scalability practices

### Score 9-10: Enterprise-Grade Governance
Key Indicators:
- All Score 7-8 elements present
- Details advanced practices (automation, governance, periodic audits)
- Solutions demonstrate real-world scalability for long-term growth
- Addresses expert-level considerations for enterprise architecture
- Includes sophisticated team coordination and quality assurance methods

AI Detection Keywords: "governance", "automation", "periodic audit", "enterprise", "scalability", "quality assurance"
Hard Boundary: Must demonstrate enterprise-level sophistication and proven practices
Progression Markers: Advanced governance, automated quality control, enterprise scalability

## AI Scoring Guidelines
Critical Score Boundaries
- Score 4 Maximum If:
  - Answer stops at structure and patterns without team collaboration aspects
  - No mention of cross-module reuse strategies
  - No discussion of team adoption or guidelines
  - Focus only on folder organization and basic patterns

- Score 6 Minimum Requires:
  - Explicit cross-module/team reuse strategies
  - Team adoption and maintenance discussions
  - Multi-team collaboration considerations

- Score 8 Minimum Requires:
  - Documentation examples or guidelines
  - Trade-off analysis with reasoning
  - Process considerations for team coordination

Progressive Requirement Validation
- Score 3-4 Requirements: (hierarchy, pattern, separation; EXCLUDES team collaboration)
- Score 5-6 Requirements: (3-4 + reuse strategy & team adoption)
- Score 7-8 Requirements: (5-6 + documentation & trade-offs)
- Score 9-10 Requirements: (7-8 + advanced governance & enterprise scalability)
');
INSERT INTO public.challenges VALUES ('challenge-performance-optimization-2025', 'Performance Optimization', 'Analisis masalah performa dan rencana optimasi ReactJS berdasarkan laporan PageSpeed Insights.', 'open-ended', 'medium', 45, 'tech-lead', '2025-08-12 14:37:35.487733', '2025-08-12 14:37:35.487733', true, '
Sebuah aplikasi company profile dibangun dengan ReactJS, dengan laporan PageSpeed Insights berikut:
https://pagespeed.web.dev/analysis/https-ait-revamp-web-sandbait-work-id/wv03qrnq9n?form_factor=mobile

Tugas:
1. Jelaskan apa saja masalah utama yang menyebabkan performa rendah pada aplikasi tersebut.
2. Jelaskan langkah-langkah kamu lakukan untuk mengoptimalkan performa aplikasi ReactJS berdasar data PageSpeed tersebut.
', NULL, NULL, NULL, '
Preliminary Checks (wajib, gagal satu = 0):
- Jawaban menyebutkan minimal satu masalah utama spesifik dari data PageSpeed Insights.
- Jawaban mencantumkan minimal satu langkah konkrit optimalisasi terkait masalah yang disebutkan.
- Tidak ada jawaban yang hanya berupa copy-paste dari tools PageSpeed (harus ada penjelasan sendiri).
- Tidak terbukti menggunakan AI tanpa analisa pribadi.

Evaluation Criteria (Max 10):
Skor 1-2:
- Masalah umum tanpa metrik/istilah teknis; solusi generik (kompres/minify) tanpa teknik lanjutan.

Skor 3-4:
- Memenuhi level sebelumnya.
- Sebut salah satu teknik: code splitting, lazy loading, analyze bundle, atau ganti library berat.
- Menyebut tools analisa bundle (mis. Webpack Bundle Analyzer / source map).
- Tidak membahas Web Vitals atau pipeline/CI/CD.

Skor 5-6:
- Memenuhi level sebelumnya.
- Menyebut minimal satu metrik Web Vitals (LCP/CLS/TTI) yang dikaitkan ke penyebab spesifik.
- Sarankan integrasi tracking (Lighthouse CI/pipeline).
- Action plan step-by-step (≥2 langkah) terkait optimasi.

Skor 7-8:
- Memenuhi level sebelumnya.
- Gunakan performance budget/threshold (mis. bundle <200KB, LCP <2.5s).
- Monitoring otomatis/alert (Slack, regression tracking).
- Jelaskan workflow tim (PR review wajib, SOP remediation).

Skor 9-10:
- Memenuhi level sebelumnya.
- Usulan standardisasi/guideline/template project untuk menjaga PageSpeed optimal ke depan.
');
INSERT INTO public.challenges VALUES ('challenge-programming-fundamentals', 'Programming Fundamentals', 'Build a functional frontend app that fetches products and implements search, pagination, and add-to-cart.', 'code', 'medium', 60, 'tech-lead', '2025-08-12 14:36:36.47989', '2025-08-12 14:36:36.47989', true, '
# Frontend Assessment – Programming Fundamentals

Buat aplikasi frontend dengan requirement berikut:
1. Ambil data produk:
   - Endpoint: https://68789a3563f24f1fdc9e98dd.mockapi.io/api/products
   - Notes: total item adalah 100
   - Referensi: https://github.com/mockapi-io/docs/wiki/Code-examples#filtering
2. Tampilkan data dalam table/list besar, dengan fitur minimal:
   - Search (pencarian)
   - Pagination
3. Add to Cart:
   - Klik "Add to cart" menambahkan item ke cart
   - Ada halaman/cart list untuk melihat item yang ditambahkan
4. Bonus: catatan/saran improvement atau design decision di README.

Catatan:
- Utamakan fungsionalitas berjalan
- Tidak perlu styling detail (fokus logic & struktur)
- **Gunakan Hash Router**, bukan Browser Router.
', 'javascript', NULL, NULL, '
Preliminary Checks (wajib, gagal satu = 0):
- Tidak ada placeholder/dummy code di komponen utama.
- Data produk berhasil di-fetch dan ditampilkan minimal dalam list.
- Tidak ada error render di console pada flow utama (fetch, add to cart, pagination).
- Tidak ada indikasi menggunakan AI.

Evaluation (Max 10, bertingkat) ringkas:
1–2: Hardcoded data; 1 file; tanpa search/pagination; tanpa loading/error.
3–4: Komponen list terpisah; ada search/pagination sederhana; ada loading & error.
5–6: Modular (list, item, search/pagination); state mgmt oke (minim prop drilling); loading/error/empty jelas.
7–8: Reusable; pisah logic fetch (custom hooks/helper); state scalable; ada improvement plan/README.
9–10: Melebihi ekspektasi; tidak terbukti cheating/AI.
');
INSERT INTO public.challenges VALUES ('challenge-testing-code-quality-2025', 'Testing & Code Quality', 'Multiple-choice tentang praktik testing & kualitas kode pada tim engineering.', 'multiple-choice', 'medium', 30, 'tech-lead', '2025-08-12 14:54:17.810696', '2025-08-12 14:54:17.810696', true, 'Pilih jawaban paling tepat terkait skenario testing & code quality.', NULL, NULL, NULL, NULL);
INSERT INTO public.challenges VALUES ('challenge-security-resilience-2025', 'Security & Resilience', 'Multiple-choice tentang praktik keamanan & resiliensi pada pengembangan frontend/engineering.', 'multiple-choice', 'medium', 30, 'tech-lead', '2025-08-12 15:04:29.684985', '2025-08-12 15:04:29.684985', true, 'Pilih jawaban paling tepat terkait skenario keamanan, ketahanan sistem, dan praktik secure engineering.', NULL, NULL, NULL, NULL);
INSERT INTO public.challenges VALUES ('challenge-programming-fundamentals-backend-2025', 'Programming Fundamentals Backend', 'Implementasi UserService in-memory dengan CRUD, batch, uniqueness email, retry untuk error sementara, logging, dan minimal satu design pattern.', 'code', 'medium', 120, 'tech-lead', '2025-08-12 15:14:45.305572', '2025-08-12 15:14:45.305572', true, '
Instruksi Penamaan:
- Nama method/fungsi HARUS persis: addUser, updateUser, deleteUser, findUserByName, findUserByEmail, addUsers, updateUsers, deleteUsers.
- Nama lain (mis. tambahUser/insertUser) tidak dinilai otomatis.

Buat modul UserService dengan requirement:
1) Fungsi Utama:
- addUser, updateUser, deleteUser (soft delete → status "inactive", data tetap ada).
- findUserByName (case-insensitive substring, hanya yang aktif).
- findUserByEmail (hanya yang aktif).

2) Batch Operation:
- addUsers(List<User> users)
- updateUsers(List<UpdateRequest> reqs)
- deleteUsers(List<String> emails)
Rules batch:
- Proses semua item, lanjut meski ada error.
- Kembalikan hasil per item (berhasil/gagal + alasan), mis. List<BatchResult>.
- Logging mencatat setiap aksi batch (sukses & gagal).

3) Aturan Email Unik:
- Email unik di seluruh storage (active & inactive).
- Di batch add: jika ada email duplikat DI DALAM batch, SEMUA item yang duplikat dianggap gagal (tidak ada yang berhasil).
- Jika email sudah ada di storage, item batch gagal.
- Hasil & log harus jelas untuk kasus duplicate (batch & storage).

4) Simulasi Error Temporary & Retry:
- Di add/update (single & batch), simulasikan TemporaryException 20%:
  if (Math.random() < 0.2) { throw new TemporaryException("Simulated temporary error"); }
- Untuk batch add/update: retry max 2x per item jika TemporaryException.
- Semua retry dicatat di log & hasil batch.

5) Validasi & Rule:
- Email valid (regex sederhana).
- Birthdate:
  - Format parseable ke LocalDate
  - Tidak boleh di masa depan
  - Usia minimal 18 tahun (hitung dari birthDate ke hari ini)
- Name/email tidak boleh null/empty.
- Update: dilarang mengubah email menjadi email milik user lain yang sudah ada.
- Soft delete: dilarang menghapus user yang sudah inactive.
- Hasil cari: kembalikan name, email, age (dari birthDate), status.

6) Error Handling:
- Gunakan custom exception untuk setiap rule violation (single & batch).
- Hasil batch tetap mencatat alasan error tiap item.

7) Logging:
- Gunakan SLF4J/Log4j: tulis nama operasi, user/email, status sebelum/sesudah (relevan), alasan error, status retry.

8) Design Pattern:
- Implement minimal satu pattern (Factory/Singleton/Strategy, dsb) & jelaskan di comment.

9) Clean Code & Dokumentasi:
- Modular, reusable, penamaan jelas, komentar di bagian penting (validasi, batch, retry, exception, pattern).

10) Data Storage:
- In-memory saja (List/Map). Tidak perlu DB/REST/file IO.

Catatan:
- Tidak perlu unit test, DB, REST, atau file IO.
- Semua output/log diverifikasi lewat Main.java.
', 'java', NULL, NULL, '
Preliminary Checks (skor 0 jika gagal salah satu):
- Nama method persis: addUser, updateUser, deleteUser, findUserByEmail, findUserByName, addUsers, updateUsers, deleteUsers.
- Data user in-memory (List/Map) saja; tanpa DB/file IO/REST.
- Minimal satu design pattern (Factory/Singleton/Strategy, dsb) + komentar penjelasan.
- Tidak ada placeholder/dummy code di fungsi utama.
- Tidak ada indikasi AI-generated content.
- Bisa dijalankan dari Main.java untuk add/update/delete/batch/search.

Evaluation (maks 10):
1–2:
- Ada addUser/deleteUser/findUserByEmail/findUserByName.
- In-memory; jalan untuk data sederhana; tanpa validasi khusus.

3–4:
- Tambah validasi: email regex valid & unik (active+inactive).
- Birthdate valid, tidak masa depan, usia ≥18.
- Name/email tidak null/empty.
- Rule violation melempar custom exception.
- Clean code tanpa duplikasi logic.

5–6:
- Batch: addUsers/updateUsers/deleteUsers persis namanya.
- Batch kembalikan List<BatchResult> (status & alasan per item).
- Batch addUsers: tolak semua email duplikat di batch (semua gagal untuk email yang bentrok); tolak email yang sudah ada di storage.
- Retry logic di addUsers/updateUsers: retry max 2x saat TemporaryException.
- Logging meaningful untuk semua operasi (success/error/retry).
- Min. satu design pattern diterapkan & dijelaskan.

7–8:
- Modular & mudah diperluas; recovery batch ada summary per batch.
- SoC jelas (service, validation, logging).

9–10:
- Melebihi ekspektasi: dokumentasi (javadoc/README) jelas & kontekstual.
');
INSERT INTO public.challenges VALUES ('challenge-architecture-design-backend-2025', 'Software Architecture and Design Backend', 'Open-ended arsitektur backend untuk aplikasi booking hotel: payment gateways, notifikasi multi-channel, sinkronisasi OTA, reporting & data correctness.', 'open-ended', 'medium', 60, 'tech-lead', '2025-08-12 15:23:18.518804', '2025-08-12 15:23:18.518804', true, '
Kamu diminta mendesain arsitektur backend untuk aplikasi booking hotel yang membutuhkan:
- Integrasi dengan berbagai payment gateway,
- Notifikasi ke user (multi-channel),
- Sinkronisasi data dengan partner OTA (Traveloka, Agoda, dsb),
- Aplikasi harus scalable, maintainable, dan siap berkembang ke depannya.

Jelaskan dengan struktur yang jelas:
- Banyak laporan penjualan harian/top sales yang makin lambat seiring pertumbuhan data transaksi.
- Tim operasional dan customer service sering menemukan data order lama (user_name, product_name, product_price) yang berbeda dengan data master saat ini, sehingga terjadi dispute saat verifikasi order atau audit.
- Bisnis ingin menambahkan fitur histori perubahan status order untuk membantu proses tracking pengiriman dan komplain pelanggan, serta rekap penjualan per kategori tanpa query berat.

Jika ada pattern atau best practice tertentu yang kamu terapkan (misal: separation of concern, SOLID, DDD, dsb.), boleh sebutkan singkat di jawabanmu
', NULL, NULL, NULL, '
Preliminary Checks (wajib, gagal satu = 0):
- Jawaban menyebutkan minimal tiga kebutuhan utama aplikasi (payment, notifikasi user, sinkronisasi OTA) secara eksplisit.
- Jawaban menyusun struktur service/module/komponen secara jelas (tidak hanya deskripsi narasi umum).
- Tidak ada placeholder atau jawaban template/AI (semua solusi spesifik ke studi kasus).
- Jawaban tidak hanya mengulang pola eksisting tanpa penjelasan tambahan.

Jika gagal satu saja, submission langsung skor 0.

Evaluation Criteria (Max 10, skor bertingkat per grade):

Score 1-2:
- Menyebut dan mendeskripsikan fungsi/service/module dasar tanpa alasan desain (“ada booking, payment, user”).
- Tidak menjelaskan boundary service/module.
- Tidak ada pembahasan trade-off, dependency, atau scalability.

Score 3-4:
- Mulai memisah fungsi dengan pemisahan sederhana (module routing, service, controller).
- Menyebut struktur folder/module dan konsistensi service secara sederhana.
- Alasan desain mulai muncul (walau umum, misal “biar rapi”).
- Menyebut integrasi dengan payment/OTA tanpa pattern/adaptor.

Score 5-6:
- Struktur modular jelas: setiap service/module punya boundary dan fungsi spesifik.
- Menjelaskan minimal satu alasan desain konkrit (scalability, maintainability, separation of concern, dsb).
- Menyebut trade-off arsitektur (monolith vs modular, adapter, shared module, dll).
- Menyebut minimal satu pattern untuk menghindari duplikasi logic (misal: utility, shared module, adapter).
- Menyebut dependency eksternal dan bagaimana diakses/integrasi (misal: payment gateway expose API).

Score 7-8:
- Alur data & boundary antar service/module dijelaskan detail, area/ownership jelas (narasi urutan data).
- Menyebut alasan desain terkait scalability, resiliency, future extensibility secara spesifik.
- Menyebut pattern integrasi/service yang lebih advance (event-driven, pub/sub, plug-and-play adaptor).
- Menjelaskan mitigasi risiko dependency failure (fallback, retry, monitoring, dsb).
- Menyebut standar/aturan tim untuk jaga codebase (review, dokumentasi, CI/CD, dsb).

Score 9-10:
- Menjelaskan standardisasi arsitektur & governance lintas tim/proyek (misal: “semua service ikut arsitektur yang sama, perubahan harus review bersama”).
- Menjelaskan alignment arsitektur dengan kebutuhan bisnis, growth, dan skalabilitas lintas tim.
- Menjelaskan pengelolaan boundary lintas tim (misal: DDD, reusable pattern, scaling/replace module tanpa gangguan sistem).
- Ada inisiatif atau improvement baru untuk maintainability/efisiensi masa depan (bukan hanya sekedar mengikuti standar eksisting).
');
INSERT INTO public.challenges VALUES ('challenge-database-dynamic-pricing-2025', 'Database', 'Open-ended: analisis & redesign dynamic pricing untuk e-commerce (promo, tier member, prioritas harga, validasi saat checkout).', 'open-ended', 'medium', 60, 'tech-lead', '2025-08-12 15:36:59.87083', '2025-08-12 15:36:59.87083', true, '
Kamu adalah backend engineer yang mewarisi sistem e-commerce berikut, yang sudah berjalan satu tahun dan sedang tumbuh pesat. Sistem ini sudah mendukung dynamic pricing, artinya:
- Setiap produk dapat memiliki harga berbeda tergantung waktu (price history), jenis promo (flash sale, diskon kuota, dsb), dan segmen user (B2B/B2C, group price, member tier).
- Satu produk bisa punya beberapa harga aktif sekaligus pada waktu tertentu, dan harga yang dipakai untuk user saat checkout harus dipilih sesuai aturan bisnis (prioritas promo, member, dst).

Database utama saat ini (dbdiagram.io):
https://dbdiagram.io/d/Assessment-dynamic-price-688195abcca18e685c73fc43

Note:
1) Harga produk bisa berubah kapan saja, baik promo maupun harga reguler.
2) Ada beberapa jenis promo (flash sale, diskon kuota, tiered pricing, dsb).
3) Harga bisa berbeda untuk member tiering, misal: gold, silver, platinum.

Masalah:
1) User menyimpan harga promo di cart, lalu checkout setelah promo berakhir, sistem tetap kasih harga promo, padahal harusnya sudah normal.
2) Satu produk bisa punya beberapa harga aktif sekaligus (karena promo dan tiering member), kalau tidak ada logika prioritas atau query yang benar, user bisa dapat harga terendah walau bukan haknya, atau harga tidak konsisten antar user.

Tugas:
1) Analisa kekurangan desain database & proses bisnis pada kasus dynamic prices:
   - Jelaskan mengapa user bisa checkout dengan harga promo/khusus yang sudah berakhir.
   - Jelaskan apa risiko/konsekuensi bisnisnya.

2) Redesain minimal database dan flow aplikasi:
   - Usulkan perubahan skema dan/atau logic agar harga yang dipakai saat checkout selalu valid sesuai waktu, user group, dan promo.
   - Wajib tampilkan skema hasil redesign (dbdiagram.io).

3) Rancang query atau logic utama pengambilan harga:
   - Berikan contoh query/logic untuk mengambil harga valid sesuai user, waktu, dan promo yang berlaku.
   - Jelaskan minimal satu edge-case (misal: harga berubah saat user checkout) dan solusi handling-nya.

4) Sebutkan best practice index database yang harus diterapkan:
   - Jelaskan index yang wajib ada agar query harga dan transaksi tetap efisien seiring data bertambah.

Catatan:
1) Jawaban harus konkrit; fokus ke dynamic prices & konsistensi harga.
2) Tidak perlu bahas partitioning/archiving/alert monitoring/scaling besar.
', NULL, NULL, NULL, '
Preliminary Checks (wajib, gagal satu = 0):
- Jawaban menyusun solusi, bukan hanya mendeskripsikan masalah.
- Jawaban memuat rekomendasi perubahan schema atau proses (tidak hanya perbaikan manual/periodik).
- Tidak ada placeholder/AI template/jawaban generic.

Evaluation Criteria (Max 10):
Score 1–2:
- Hanya bahas update harga manual; tidak bahas cart vs checkout; tak ada prioritas; tak ada query validasi; skema tetap.

Score 3–4:
- Menyebut promo/member/tiering tapi solusi parsial; query sederhana tanpa prioritas; ada price history tapi belum nyambung promo/tier dan belum handle overlap.

Score 5–6:
- Desain tabel dynamic price dengan relasi promo/tier/priority; query checkout pakai waktu sekarang + user group/tier + urutan prioritas; checkout force validasi harga (bukan ambil dari cart); handling overlap jelas (promo > tier > reguler); sebut edge-case & solusi; rekomendasi index.

Score 7–8:
- Skema & flow siap scale/maintain (versioning harga, kolom priority/weight, extensible jenis harga); rule prioritas fleksibel; flow checkout antisipasi perubahan dinamis; modular/reusable; best practice index + alasan.

Score 9–10:
- Guideline/policy pricing lintas tim; extensibility tambah jenis promo/tier/rule tanpa overhaul; standardisasi logika prioritas; kesiapan multi-segment/produk/mata uang; arsitektur sustain untuk enterprise.
');


--
-- TOC entry 3502 (class 0 OID 2847183)
-- Dependencies: 224
-- Data for Name: code_submission_files; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3504 (class 0 OID 2847197)
-- Dependencies: 226
-- Data for Name: multiple_choice_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.multiple_choice_answers VALUES (1, 'submission-1755066642217', 1, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (2, 'submission-1755066642217', 2, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (3, 'submission-1755066642217', 3, 'B', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (4, 'submission-1755066642217', 4, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (5, 'submission-1755066642217', 5, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (6, 'submission-1755066642217', 6, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (7, 'submission-1755066642217', 7, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (8, 'submission-1755066642217', 8, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (9, 'submission-1755066642217', 9, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (10, 'submission-1755066642217', 10, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (11, 'submission-1755066671934', 11, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (12, 'submission-1755066671934', 12, 'D', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (13, 'submission-1755066671934', 13, 'C', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (14, 'submission-1755066671934', 14, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (15, 'submission-1755066671934', 15, 'B', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (16, 'submission-1755066671934', 16, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (17, 'submission-1755066671934', 17, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (18, 'submission-1755066671934', 18, 'B', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (19, 'submission-1755066671934', 19, 'C', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (20, 'submission-1755066671934', 20, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (21, 'submission-1755136183787', 1, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (22, 'submission-1755136183787', 2, 'C', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (23, 'submission-1755136183787', 3, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (24, 'submission-1755136183787', 4, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (25, 'submission-1755136183787', 5, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (26, 'submission-1755136183787', 6, 'B', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (27, 'submission-1755136183787', 7, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (28, 'submission-1755136183787', 8, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (29, 'submission-1755136183787', 9, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (30, 'submission-1755136183787', 10, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (31, 'submission-1755136207628', 11, 'A', true, 1.00);
INSERT INTO public.multiple_choice_answers VALUES (32, 'submission-1755136207628', 12, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (33, 'submission-1755136207628', 13, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (34, 'submission-1755136207628', 14, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (35, 'submission-1755136207628', 15, 'A', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (36, 'submission-1755136207628', 16, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (37, 'submission-1755136207628', 17, 'B', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (38, 'submission-1755136207628', 18, 'C', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (39, 'submission-1755136207628', 19, 'C', false, 0.00);
INSERT INTO public.multiple_choice_answers VALUES (40, 'submission-1755136207628', 20, 'B', false, 0.00);


--
-- TOC entry 3495 (class 0 OID 2847087)
-- Dependencies: 217
-- Data for Name: multiple_choice_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.multiple_choice_options VALUES (1, 1, 'A', 'Diskusikan di tim, set rule agar test lebih meaningful sebelum tambah test baru', true, 1);
INSERT INTO public.multiple_choice_options VALUES (2, 1, 'B', 'Accept dulu, lalu buat backlog untuk refactor test dummy ke test valid', false, 2);
INSERT INTO public.multiple_choice_options VALUES (3, 1, 'C', 'Lanjut develop, tapi monitor error di production, jika ada baru perbaiki test', false, 3);
INSERT INTO public.multiple_choice_options VALUES (4, 1, 'D', 'Segera hapus semua test dummy, update coverage, lalu announce di grup', false, 4);
INSERT INTO public.multiple_choice_options VALUES (5, 2, 'A', 'Push release sesuai jadwal, bug bisa diperbaiki nanti', false, 1);
INSERT INTO public.multiple_choice_options VALUES (6, 2, 'B', 'Tunda release, pastikan bug diperbaiki dan QA retest', false, 2);
INSERT INTO public.multiple_choice_options VALUES (7, 2, 'C', 'Release, sambil informasikan bug ke PO dan QA, buat plan follow-up fix', true, 3);
INSERT INTO public.multiple_choice_options VALUES (8, 2, 'D', 'Approve deploy, tapi minta QA manual test di production', false, 4);
INSERT INTO public.multiple_choice_options VALUES (9, 3, 'A', 'Approve, lalu diskusikan risiko coverage di grup', false, 1);
INSERT INTO public.multiple_choice_options VALUES (10, 3, 'B', 'Minta developer split PR jadi lebih kecil dan tambah test', true, 2);
INSERT INTO public.multiple_choice_options VALUES (11, 3, 'C', 'Review bagian utama saja, sisanya trust ke CI/CD', false, 3);
INSERT INTO public.multiple_choice_options VALUES (12, 3, 'D', 'Approve, tapi assign reviewer tambahan untuk cek bagian lain', false, 4);
INSERT INTO public.multiple_choice_options VALUES (13, 4, 'A', 'Tulis test untuk bug tersebut, audit test case lain, dan review proses coverage', true, 1);
INSERT INTO public.multiple_choice_options VALUES (14, 4, 'B', 'Tulis test baru saja tanpa evaluasi proses', false, 2);
INSERT INTO public.multiple_choice_options VALUES (15, 4, 'C', 'Lakukan post-mortem, buat rencana perbaikan coverage', false, 3);
INSERT INTO public.multiple_choice_options VALUES (16, 4, 'D', 'Prioritaskan fix bug saja, coverage urusan nanti', false, 4);
INSERT INTO public.multiple_choice_options VALUES (17, 5, 'A', 'Cek kualitas test, tambahkan edge case, evaluasi coverage tools', true, 1);
INSERT INTO public.multiple_choice_options VALUES (18, 5, 'B', 'Diskusikan dengan QA, buat spike investigasi di sprint berikutnya', false, 2);
INSERT INTO public.multiple_choice_options VALUES (19, 5, 'C', 'Minta developer perbaiki dan tambahkan test sebelum merge', false, 3);
INSERT INTO public.multiple_choice_options VALUES (20, 5, 'D', 'Log bug di backlog, bahas saat retro', false, 4);
INSERT INTO public.multiple_choice_options VALUES (21, 6, 'A', 'Approve deploy, catat technical debt, prioritaskan test di sprint berikutnya', false, 1);
INSERT INTO public.multiple_choice_options VALUES (22, 6, 'B', 'Minta minimal test untuk fungsi utama sebelum deploy', true, 2);
INSERT INTO public.multiple_choice_options VALUES (23, 6, 'C', 'Deploy, lalu jalankan test manual oleh QA', false, 3);
INSERT INTO public.multiple_choice_options VALUES (24, 6, 'D', 'Deploy, sambil siapkan dokumentasi risiko di Confluence', false, 4);
INSERT INTO public.multiple_choice_options VALUES (25, 7, 'A', 'Sosialisasi benefit quality gate, usulkan evaluasi bertahap dengan WIP limit', true, 1);
INSERT INTO public.multiple_choice_options VALUES (26, 7, 'B', 'Setuju, tapi minta pengecualian untuk hotfix/urgent', false, 2);
INSERT INTO public.multiple_choice_options VALUES (27, 7, 'C', 'Lakukan A/B testing policy di sebagian repo, lihat dampaknya', false, 3);
INSERT INTO public.multiple_choice_options VALUES (28, 7, 'D', 'Usulkan policy quality gate tapi longgar targetnya dulu', false, 4);
INSERT INTO public.multiple_choice_options VALUES (29, 8, 'A', 'Fix bug, refactor area terdampak, rencanakan refactor penuh', true, 1);
INSERT INTO public.multiple_choice_options VALUES (30, 8, 'B', 'Refactor semua logic sekaligus sebelum fix bug', false, 2);
INSERT INTO public.multiple_choice_options VALUES (31, 8, 'C', 'Fix bug dulu, catat refactor sebagai backlog', false, 3);
INSERT INTO public.multiple_choice_options VALUES (32, 8, 'D', 'Komunikasi ke user soal risiko sebelum perbaikan', false, 4);
INSERT INTO public.multiple_choice_options VALUES (33, 9, 'A', 'One-on-one coaching tentang pentingnya review dan beri contoh', true, 1);
INSERT INTO public.multiple_choice_options VALUES (34, 9, 'B', 'Bahas di group, buat aturan approve minimal 2 orang', false, 2);
INSERT INTO public.multiple_choice_options VALUES (35, 9, 'C', 'Delegasikan review ke developer senior', false, 3);
INSERT INTO public.multiple_choice_options VALUES (36, 9, 'D', 'Tolak hak approve untuk sementara dan review bareng', false, 4);
INSERT INTO public.multiple_choice_options VALUES (37, 10, 'A', 'Propose reviewer pool/rotasi, atur WIP limit review, dan time slot khusus', true, 1);
INSERT INTO public.multiple_choice_options VALUES (38, 10, 'B', 'Minta tim disiplin daily untuk alokasi waktu review', false, 2);
INSERT INTO public.multiple_choice_options VALUES (39, 10, 'C', 'Buka diskusi, coba assign reviewer eksternal sementara', false, 3);
INSERT INTO public.multiple_choice_options VALUES (40, 10, 'D', 'Dokumentasikan kendala di retro, bahas bersama PO', false, 4);
INSERT INTO public.multiple_choice_options VALUES (41, 11, 'A', 'Koordinasi ke PO dan QA, release, tapi jadwalkan patch dan monitor issue', true, 1);
INSERT INTO public.multiple_choice_options VALUES (42, 11, 'B', 'Force update dependency sebelum release, walau delay', false, 2);
INSERT INTO public.multiple_choice_options VALUES (43, 11, 'C', 'Rilis saja, issue medium biasanya aman', false, 3);
INSERT INTO public.multiple_choice_options VALUES (44, 11, 'D', 'Tulis warning di backlog, patch jika ada waktu luang', false, 4);
INSERT INTO public.multiple_choice_options VALUES (45, 12, 'A', 'Approve, next sprint baru patch output', false, 1);
INSERT INTO public.multiple_choice_options VALUES (46, 12, 'B', 'Diskusi dengan dev dan QA untuk update patch agar cover input & output', true, 2);
INSERT INTO public.multiple_choice_options VALUES (47, 12, 'C', 'Merge, karena dev sudah responsif', false, 3);
INSERT INTO public.multiple_choice_options VALUES (48, 12, 'D', 'Info ke PO dan merge, catat issue di backlog', false, 4);
INSERT INTO public.multiple_choice_options VALUES (49, 13, 'A', 'Approve jika test lulus, review nanti', false, 1);
INSERT INTO public.multiple_choice_options VALUES (50, 13, 'B', 'Tunda approve, request test case baru untuk edge case dan skenario abuse', true, 2);
INSERT INTO public.multiple_choice_options VALUES (51, 13, 'C', 'Approve dan push issue ke backlog security', false, 3);
INSERT INTO public.multiple_choice_options VALUES (52, 13, 'D', 'Minta PO dan QA cek dulu sebelum merge', false, 4);
INSERT INTO public.multiple_choice_options VALUES (53, 14, 'A', 'Approve, repo internal aman', false, 1);
INSERT INTO public.multiple_choice_options VALUES (54, 14, 'B', 'Sarankan pindahkan ke env file, update documentation, inform tim security', true, 2);
INSERT INTO public.multiple_choice_options VALUES (55, 14, 'C', 'Biarkan saja, update kalau sudah public', false, 3);
INSERT INTO public.multiple_choice_options VALUES (56, 14, 'D', 'Segera rotate API key dan tag security team', false, 4);
INSERT INTO public.multiple_choice_options VALUES (57, 15, 'A', 'Approve dengan catatan file di QA test dulu', false, 1);
INSERT INTO public.multiple_choice_options VALUES (58, 15, 'B', 'Tunda merge, diskusi solusi cepat validasi type di backend dan rekomendasikan minimal whitelist extension', true, 2);
INSERT INTO public.multiple_choice_options VALUES (59, 15, 'C', 'Approve saja, user akan hati-hati', false, 3);
INSERT INTO public.multiple_choice_options VALUES (60, 15, 'D', 'Approve, tapi input warning ke user', false, 4);
INSERT INTO public.multiple_choice_options VALUES (61, 16, 'A', 'Minta audit dependency, cek izin widget, diskusikan dengan security team', true, 1);
INSERT INTO public.multiple_choice_options VALUES (62, 16, 'B', 'Approve saja, widget populer dan banyak bintang di Github', false, 2);
INSERT INTO public.multiple_choice_options VALUES (63, 16, 'C', 'Approve, asal widget update terbaru', false, 3);
INSERT INTO public.multiple_choice_options VALUES (64, 16, 'D', 'Tulis warning di PR, review nanti', false, 4);
INSERT INTO public.multiple_choice_options VALUES (65, 17, 'A', 'Approve patch, lalu plan refactor nanti', false, 1);
INSERT INTO public.multiple_choice_options VALUES (66, 17, 'B', 'Tolak patch, request implementasi parameterized query sekarang', false, 2);
INSERT INTO public.multiple_choice_options VALUES (67, 17, 'C', 'Approve, asal coverage test naik', false, 3);
INSERT INTO public.multiple_choice_options VALUES (68, 17, 'D', 'Diskusikan risiko dengan dev & QA, jadwalkan improvement, merge jika blocker bisnis', true, 4);
INSERT INTO public.multiple_choice_options VALUES (69, 18, 'A', 'Lanjut release, dokumentasi bisa nyusul', false, 1);
INSERT INTO public.multiple_choice_options VALUES (70, 18, 'B', 'Diskusi dengan devops/security, pastikan ada minimal policy sementara, dan buat plan update setelah release', true, 2);
INSERT INTO public.multiple_choice_options VALUES (71, 18, 'C', 'Tolak release sampai policy IAM fix', false, 3);
INSERT INTO public.multiple_choice_options VALUES (72, 18, 'D', 'Update manual ke doc, review minggu depan', false, 4);
INSERT INTO public.multiple_choice_options VALUES (73, 19, 'A', 'Komunikasi tim, temporary disable endpoint/expose minimal, infokan PO dan customer jika perlu', true, 1);
INSERT INTO public.multiple_choice_options VALUES (74, 19, 'B', 'Patch saja pelan-pelan, tunggu jadwal maintenance', false, 2);
INSERT INTO public.multiple_choice_options VALUES (75, 19, 'C', 'Ignore, risiko kecil', false, 3);
INSERT INTO public.multiple_choice_options VALUES (76, 19, 'D', 'Catat bug di backlog, patch saat sprint selesai', false, 4);
INSERT INTO public.multiple_choice_options VALUES (77, 20, 'A', 'Review risk dan diskusi mitigasi (fork, cari alternatif, audit source code), inform ke seluruh tim', true, 1);
INSERT INTO public.multiple_choice_options VALUES (78, 20, 'B', 'Hapus library segera, cari pengganti apapun', false, 2);
INSERT INTO public.multiple_choice_options VALUES (79, 20, 'C', 'Ignore, library masih works', false, 3);
INSERT INTO public.multiple_choice_options VALUES (80, 20, 'D', 'Minta audit QA saja, lanjutkan delivery', false, 4);


--
-- TOC entry 3493 (class 0 OID 2847071)
-- Dependencies: 215
-- Data for Name: multiple_choice_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.multiple_choice_questions VALUES (1, 'challenge-testing-code-quality-2025', 'Coverage project tiba-tiba naik karena test dummy (test tanpa assert). Bagaimana Anda menyikapinya?', NULL, 1, 1);
INSERT INTO public.multiple_choice_questions VALUES (2, 'challenge-testing-code-quality-2025', 'PO mendesak deploy fitur baru secepatnya, tapi QA menemukan 1 critical bug di staging. Waktu release tinggal 1 jam. Apa langkah Anda sebagai engineer?', NULL, 2, 1);
INSERT INTO public.multiple_choice_questions VALUES (3, 'challenge-testing-code-quality-2025', 'Seorang developer submit PR besar (>1,000 baris), hanya 10% yang ada unit test. Reviewer tidak sempat cek semua kode. Sikap reviewer?', NULL, 3, 1);
INSERT INTO public.multiple_choice_questions VALUES (4, 'challenge-testing-code-quality-2025', 'Setelah deploy, muncul bug yang lolos karena test coverage hanya fokus happy path. Bagaimana tindak lanjut tim?', NULL, 4, 1);
INSERT INTO public.multiple_choice_questions VALUES (5, 'challenge-testing-code-quality-2025', 'QA melaporkan regression bug yang tidak pernah muncul sebelumnya, padahal coverage >90%. Apa sikap Anda sebagai reviewer?', NULL, 5, 1);
INSERT INTO public.multiple_choice_questions VALUES (6, 'challenge-testing-code-quality-2025', 'Tim migrasi ke microservices, ada service baru tanpa test karena deadline. Tindakan Anda?', NULL, 6, 1);
INSERT INTO public.multiple_choice_questions VALUES (7, 'challenge-testing-code-quality-2025', 'Lead ingin quality gate ketat di CI/CD pipeline. Beberapa tim keberatan takut menghambat delivery. Solusi Anda?', NULL, 7, 1);
INSERT INTO public.multiple_choice_questions VALUES (8, 'challenge-testing-code-quality-2025', 'Terdeteksi duplikasi logic di beberapa file legacy, user komplain bug di area terdampak. Prioritas Anda?', NULL, 8, 1);
INSERT INTO public.multiple_choice_questions VALUES (9, 'challenge-testing-code-quality-2025', 'Seorang junior dev selalu approve PR tanpa review, agar cepat closing task. Sikap Anda sebagai lead?', NULL, 9, 1);
INSERT INTO public.multiple_choice_questions VALUES (10, 'challenge-testing-code-quality-2025', 'Dalam retro, proses review lambat karena semua reviewer sibuk project lain. Inisiatif Anda?', NULL, 10, 1);
INSERT INTO public.multiple_choice_questions VALUES (11, 'challenge-security-resilience-2025', 'Ada dependency kritikal dapat warning vulnerability medium, release tinggal 1 hari. PO minta tetap delivery. Apa langkah reviewer?', NULL, 1, 1);
INSERT INTO public.multiple_choice_questions VALUES (12, 'challenge-security-resilience-2025', 'QA report XSS, dev sudah patch di filter input. Reviewer cek, patch belum cover output encode. Sikap reviewer?', NULL, 2, 1);
INSERT INTO public.multiple_choice_questions VALUES (13, 'challenge-security-resilience-2025', 'Ada PR yang mengubah validasi input user jadi lebih longgar (lebih sedikit cek type/data), reviewer sibuk audit. Sikap reviewer?', NULL, 3, 1);
INSERT INTO public.multiple_choice_questions VALUES (14, 'challenge-security-resilience-2025', 'Security audit menemukan penggunaan API key di codebase public repo, tapi repo hanya diakses internal. Apa langkah reviewer?', NULL, 4, 1);
INSERT INTO public.multiple_choice_questions VALUES (15, 'challenge-security-resilience-2025', 'Ada permintaan fitur upload file eksternal, deadline ketat. Belum ada implementasi file type validation. Reviewer?', NULL, 5, 1);
INSERT INTO public.multiple_choice_questions VALUES (16, 'challenge-security-resilience-2025', 'Tim frontend gunakan 3rd party widget untuk charting, tanpa audit dependency. Security team minta justifikasi. Sikap reviewer?', NULL, 6, 1);
INSERT INTO public.multiple_choice_questions VALUES (17, 'challenge-security-resilience-2025', 'Saat incident bug di backend, dev patch hanya dengan menambah filter input, tanpa update parameterized query. Reviewer?', NULL, 7, 1);
INSERT INTO public.multiple_choice_questions VALUES (18, 'challenge-security-resilience-2025', 'Migrasi ke cloud provider baru, dokumentasi policy IAM & audit log masih belum lengkap. Release tinggal 3 hari. Sikap reviewer?', NULL, 8, 1);
INSERT INTO public.multiple_choice_questions VALUES (19, 'challenge-security-resilience-2025', 'Ditemukan bug critical security di API production, belum ada exploit, patch butuh waktu. Apa action reviewer?', NULL, 9, 1);
INSERT INTO public.multiple_choice_questions VALUES (20, 'challenge-security-resilience-2025', 'Ada open source library populer dipakai di core system, maintainer sudah inaktif >2 tahun, tim security baru aware. Apa sikap reviewer?', NULL, 10, 1);


--
-- TOC entry 3508 (class 0 OID 2847228)
-- Dependencies: 230
-- Data for Name: session_activity; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 218
-- Name: assessment_challenges_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.assessment_challenges_id_seq', 11, true);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 227
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 1, false);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 212
-- Name: challenge_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challenge_files_id_seq', 2, true);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 223
-- Name: code_submission_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.code_submission_files_id_seq', 1, false);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 225
-- Name: multiple_choice_answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.multiple_choice_answers_id_seq', 40, true);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 216
-- Name: multiple_choice_options_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.multiple_choice_options_id_seq', 80, true);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 214
-- Name: multiple_choice_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.multiple_choice_questions_id_seq', 20, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 229
-- Name: session_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_activity_id_seq', 1, false);


--
-- TOC entry 3289 (class 2606 OID 2847111)
-- Name: assessment_challenges assessment_challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_challenges
    ADD CONSTRAINT assessment_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 2847144)
-- Name: assessment_sessions assessment_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_sessions
    ADD CONSTRAINT assessment_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 2847041)
-- Name: assessments assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessments
    ADD CONSTRAINT assessments_pkey PRIMARY KEY (id);


--
-- TOC entry 3322 (class 2606 OID 2847226)
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3294 (class 2606 OID 2847131)
-- Name: candidates candidates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.candidates
    ADD CONSTRAINT candidates_pkey PRIMARY KEY (id);


--
-- TOC entry 3278 (class 2606 OID 2847064)
-- Name: challenge_files challenge_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_files
    ADD CONSTRAINT challenge_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 2847166)
-- Name: challenge_submissions challenge_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_submissions
    ADD CONSTRAINT challenge_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 2847053)
-- Name: challenges challenges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 2847190)
-- Name: code_submission_files code_submission_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_submission_files
    ADD CONSTRAINT code_submission_files_pkey PRIMARY KEY (id);


--
-- TOC entry 3319 (class 2606 OID 2847204)
-- Name: multiple_choice_answers multiple_choice_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_answers
    ADD CONSTRAINT multiple_choice_answers_pkey PRIMARY KEY (id);


--
-- TOC entry 3286 (class 2606 OID 2847096)
-- Name: multiple_choice_options multiple_choice_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_options
    ADD CONSTRAINT multiple_choice_options_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 2847080)
-- Name: multiple_choice_questions multiple_choice_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_questions
    ADD CONSTRAINT multiple_choice_questions_pkey PRIMARY KEY (id);


--
-- TOC entry 3331 (class 2606 OID 2847238)
-- Name: session_activity session_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_activity
    ADD CONSTRAINT session_activity_pkey PRIMARY KEY (id);


--
-- TOC entry 3323 (class 1259 OID 2847281)
-- Name: idx_action_audit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_action_audit ON public.audit_log USING btree (action);


--
-- TOC entry 3327 (class 1259 OID 2847284)
-- Name: idx_activity_type_activity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_type_activity ON public.session_activity USING btree (activity_type);


--
-- TOC entry 3290 (class 1259 OID 2847258)
-- Name: idx_assessment_id_ac; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessment_id_ac ON public.assessment_challenges USING btree (assessment_id);


--
-- TOC entry 3299 (class 1259 OID 2847263)
-- Name: idx_assessment_id_sessions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_assessment_id_sessions ON public.assessment_sessions USING btree (assessment_id);


--
-- TOC entry 3300 (class 1259 OID 2847264)
-- Name: idx_candidate_id_sessions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_candidate_id_sessions ON public.assessment_sessions USING btree (candidate_id);


--
-- TOC entry 3306 (class 1259 OID 2847270)
-- Name: idx_candidate_id_submissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_candidate_id_submissions ON public.challenge_submissions USING btree (candidate_id);


--
-- TOC entry 3291 (class 1259 OID 2847259)
-- Name: idx_challenge_id_ac; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenge_id_ac ON public.assessment_challenges USING btree (challenge_id);


--
-- TOC entry 3279 (class 1259 OID 2847253)
-- Name: idx_challenge_id_files; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenge_id_files ON public.challenge_files USING btree (challenge_id);


--
-- TOC entry 3281 (class 1259 OID 2847254)
-- Name: idx_challenge_id_mcq; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenge_id_mcq ON public.multiple_choice_questions USING btree (challenge_id);


--
-- TOC entry 3307 (class 1259 OID 2847269)
-- Name: idx_challenge_id_submissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_challenge_id_submissions ON public.challenge_submissions USING btree (challenge_id);


--
-- TOC entry 3324 (class 1259 OID 2847282)
-- Name: idx_changed_at_audit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_changed_at_audit ON public.audit_log USING btree (changed_at);


--
-- TOC entry 3295 (class 1259 OID 2847262)
-- Name: idx_created_at_candidates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_created_at_candidates ON public.candidates USING btree (created_at);


--
-- TOC entry 3269 (class 1259 OID 2847247)
-- Name: idx_created_by_assessments; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_created_by_assessments ON public.assessments USING btree (created_by);


--
-- TOC entry 3273 (class 1259 OID 2847251)
-- Name: idx_created_by_challenges; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_created_by_challenges ON public.challenges USING btree (created_by);


--
-- TOC entry 3274 (class 1259 OID 2847250)
-- Name: idx_difficulty_challenges; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_difficulty_challenges ON public.challenges USING btree (difficulty);


--
-- TOC entry 3296 (class 1259 OID 2847261)
-- Name: idx_email_candidates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_candidates ON public.candidates USING btree (email);


--
-- TOC entry 3270 (class 1259 OID 2847248)
-- Name: idx_is_active_assessments; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_is_active_assessments ON public.assessments USING btree (is_active);


--
-- TOC entry 3275 (class 1259 OID 2847252)
-- Name: idx_is_active_challenges; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_is_active_challenges ON public.challenges USING btree (is_active);


--
-- TOC entry 3316 (class 1259 OID 2847277)
-- Name: idx_question_id_mc_answers; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_question_id_mc_answers ON public.multiple_choice_answers USING btree (question_id);


--
-- TOC entry 3284 (class 1259 OID 2847256)
-- Name: idx_question_id_options; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_question_id_options ON public.multiple_choice_options USING btree (question_id);


--
-- TOC entry 3325 (class 1259 OID 2847280)
-- Name: idx_record_id_audit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_record_id_audit ON public.audit_log USING btree (record_id);


--
-- TOC entry 3328 (class 1259 OID 2847283)
-- Name: idx_session_id_activity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_session_id_activity ON public.session_activity USING btree (session_id);


--
-- TOC entry 3308 (class 1259 OID 2847268)
-- Name: idx_session_id_submissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_session_id_submissions ON public.challenge_submissions USING btree (session_id);


--
-- TOC entry 3301 (class 1259 OID 2847266)
-- Name: idx_session_token_sessions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_session_token_sessions ON public.assessment_sessions USING btree (session_token);


--
-- TOC entry 3302 (class 1259 OID 2847265)
-- Name: idx_status_sessions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_sessions ON public.assessment_sessions USING btree (status);


--
-- TOC entry 3309 (class 1259 OID 2847272)
-- Name: idx_status_submissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_status_submissions ON public.challenge_submissions USING btree (status);


--
-- TOC entry 3314 (class 1259 OID 2847274)
-- Name: idx_submission_id_code_files; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submission_id_code_files ON public.code_submission_files USING btree (submission_id);


--
-- TOC entry 3317 (class 1259 OID 2847276)
-- Name: idx_submission_id_mc_answers; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submission_id_mc_answers ON public.multiple_choice_answers USING btree (submission_id);


--
-- TOC entry 3310 (class 1259 OID 2847271)
-- Name: idx_submission_type_submissions; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_submission_type_submissions ON public.challenge_submissions USING btree (submission_type);


--
-- TOC entry 3326 (class 1259 OID 2847279)
-- Name: idx_table_name_audit; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_table_name_audit ON public.audit_log USING btree (table_name);


--
-- TOC entry 3329 (class 1259 OID 2848213)
-- Name: idx_timestamp_activity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_timestamp_activity ON public.session_activity USING btree ("timestamp");


--
-- TOC entry 3276 (class 1259 OID 2847249)
-- Name: idx_type_challenges; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_type_challenges ON public.challenges USING btree (type);


--
-- TOC entry 3292 (class 1259 OID 2847260)
-- Name: unique_assessment_challenge; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_assessment_challenge ON public.assessment_challenges USING btree (assessment_id, challenge_id);


--
-- TOC entry 3303 (class 1259 OID 2847267)
-- Name: unique_candidate_assessment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_candidate_assessment ON public.assessment_sessions USING btree (candidate_id, assessment_id);


--
-- TOC entry 3280 (class 1259 OID 2847255)
-- Name: unique_challenge_file; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_challenge_file ON public.challenge_files USING btree (challenge_id, file_name);


--
-- TOC entry 3287 (class 1259 OID 2847257)
-- Name: unique_question_option; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_question_option ON public.multiple_choice_options USING btree (question_id, option_id);


--
-- TOC entry 3311 (class 1259 OID 2847273)
-- Name: unique_session_challenge; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_session_challenge ON public.challenge_submissions USING btree (session_id, challenge_id);


--
-- TOC entry 3315 (class 1259 OID 2847275)
-- Name: unique_submission_file; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_submission_file ON public.code_submission_files USING btree (submission_id, file_name);


--
-- TOC entry 3320 (class 1259 OID 2847278)
-- Name: unique_submission_question; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_submission_question ON public.multiple_choice_answers USING btree (submission_id, question_id);


--
-- TOC entry 3485 (class 2618 OID 2847298)
-- Name: assessment_summary _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.assessment_summary AS
 SELECT a.id,
    a.title,
    a.description,
    a.created_by,
    a.created_at,
    a.updated_at,
    a.is_active,
    a.time_limit_minutes,
    a.passing_score,
    a.instructions,
    count(ac.challenge_id) AS total_challenges,
    count(
        CASE
            WHEN (c.type = 'code'::public.challenge_type) THEN 1
            ELSE NULL::integer
        END) AS code_challenges,
    count(
        CASE
            WHEN (c.type = 'open-ended'::public.challenge_type) THEN 1
            ELSE NULL::integer
        END) AS open_ended_challenges,
    count(
        CASE
            WHEN (c.type = 'multiple-choice'::public.challenge_type) THEN 1
            ELSE NULL::integer
        END) AS multiple_choice_challenges
   FROM ((public.assessments a
     LEFT JOIN public.assessment_challenges ac ON (((a.id)::text = (ac.assessment_id)::text)))
     LEFT JOIN public.challenges c ON (((ac.challenge_id)::text = (c.id)::text)))
  WHERE ((a.is_active = true) AND ((c.is_active IS NULL) OR (c.is_active = true)))
  GROUP BY a.id;


--
-- TOC entry 3486 (class 2618 OID 2847303)
-- Name: session_progress _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.session_progress AS
 SELECT s.id,
    s.assessment_id,
    s.candidate_id,
    s.status,
    s.started_at,
    s.completed_at,
    s.expires_at,
    s.total_score,
    s.passing_score,
    s.is_passed,
    s.session_token,
    s.ip_address,
    s.user_agent,
    count(cs.id) AS total_submissions,
    count(
        CASE
            WHEN (cs.status = 'submitted'::public.submission_status_enum) THEN 1
            ELSE NULL::integer
        END) AS completed_challenges,
    count(ac.challenge_id) AS total_challenges,
    round((((count(
        CASE
            WHEN (cs.status = 'submitted'::public.submission_status_enum) THEN 1
            ELSE NULL::integer
        END) / count(ac.challenge_id)) * 100))::numeric, 2) AS completion_percentage,
    avg(cs.score) AS average_score
   FROM ((public.assessment_sessions s
     JOIN public.assessment_challenges ac ON (((s.assessment_id)::text = (ac.assessment_id)::text)))
     LEFT JOIN public.challenge_submissions cs ON ((((s.id)::text = (cs.session_id)::text) AND ((ac.challenge_id)::text = (cs.challenge_id)::text))))
  GROUP BY s.id;


--
-- TOC entry 3487 (class 2618 OID 2847308)
-- Name: multiple_choice_scores _RETURN; Type: RULE; Schema: public; Owner: postgres
--

CREATE OR REPLACE VIEW public.multiple_choice_scores AS
 SELECT cs.id AS submission_id,
    cs.session_id,
    cs.challenge_id,
    count(mca.id) AS total_questions,
    count(
        CASE
            WHEN (mca.is_correct = true) THEN 1
            ELSE NULL::integer
        END) AS correct_answers,
    round((((count(
        CASE
            WHEN (mca.is_correct = true) THEN 1
            ELSE NULL::integer
        END) / count(mca.id)) * 100))::numeric, 2) AS score_percentage,
    sum(mca.points_earned) AS total_points,
    sum(mcq.points) AS max_points
   FROM ((public.challenge_submissions cs
     JOIN public.multiple_choice_answers mca ON (((cs.id)::text = (mca.submission_id)::text)))
     JOIN public.multiple_choice_questions mcq ON ((mca.question_id = mcq.id)))
  WHERE (cs.submission_type = 'multiple-choice'::public.submission_type_enum)
  GROUP BY cs.id;


--
-- TOC entry 3335 (class 2606 OID 2847112)
-- Name: assessment_challenges assessment_challenges_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_challenges
    ADD CONSTRAINT assessment_challenges_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- TOC entry 3336 (class 2606 OID 2847117)
-- Name: assessment_challenges assessment_challenges_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_challenges
    ADD CONSTRAINT assessment_challenges_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- TOC entry 3337 (class 2606 OID 2847145)
-- Name: assessment_sessions assessment_sessions_assessment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_sessions
    ADD CONSTRAINT assessment_sessions_assessment_id_fkey FOREIGN KEY (assessment_id) REFERENCES public.assessments(id) ON DELETE CASCADE;


--
-- TOC entry 3338 (class 2606 OID 2847150)
-- Name: assessment_sessions assessment_sessions_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assessment_sessions
    ADD CONSTRAINT assessment_sessions_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;


--
-- TOC entry 3332 (class 2606 OID 2847065)
-- Name: challenge_files challenge_files_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_files
    ADD CONSTRAINT challenge_files_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- TOC entry 3339 (class 2606 OID 2847177)
-- Name: challenge_submissions challenge_submissions_candidate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_submissions
    ADD CONSTRAINT challenge_submissions_candidate_id_fkey FOREIGN KEY (candidate_id) REFERENCES public.candidates(id) ON DELETE CASCADE;


--
-- TOC entry 3340 (class 2606 OID 2847172)
-- Name: challenge_submissions challenge_submissions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_submissions
    ADD CONSTRAINT challenge_submissions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- TOC entry 3341 (class 2606 OID 2847167)
-- Name: challenge_submissions challenge_submissions_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challenge_submissions
    ADD CONSTRAINT challenge_submissions_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.assessment_sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3342 (class 2606 OID 2847191)
-- Name: code_submission_files code_submission_files_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.code_submission_files
    ADD CONSTRAINT code_submission_files_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.challenge_submissions(id) ON DELETE CASCADE;


--
-- TOC entry 3343 (class 2606 OID 2847210)
-- Name: multiple_choice_answers multiple_choice_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_answers
    ADD CONSTRAINT multiple_choice_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.multiple_choice_questions(id) ON DELETE CASCADE;


--
-- TOC entry 3344 (class 2606 OID 2847205)
-- Name: multiple_choice_answers multiple_choice_answers_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_answers
    ADD CONSTRAINT multiple_choice_answers_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.challenge_submissions(id) ON DELETE CASCADE;


--
-- TOC entry 3334 (class 2606 OID 2847097)
-- Name: multiple_choice_options multiple_choice_options_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_options
    ADD CONSTRAINT multiple_choice_options_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.multiple_choice_questions(id) ON DELETE CASCADE;


--
-- TOC entry 3333 (class 2606 OID 2847081)
-- Name: multiple_choice_questions multiple_choice_questions_challenge_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.multiple_choice_questions
    ADD CONSTRAINT multiple_choice_questions_challenge_id_fkey FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;


--
-- TOC entry 3345 (class 2606 OID 2847239)
-- Name: session_activity session_activity_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_activity
    ADD CONSTRAINT session_activity_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.assessment_sessions(id) ON DELETE CASCADE;


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2025-08-15 08:16:41

--
-- PostgreSQL database dump complete
--

