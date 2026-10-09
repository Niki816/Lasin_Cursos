-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" VARCHAR(50) NOT NULL DEFAULT 'admin',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "nivel" VARCHAR(100),
    "modalidad" VARCHAR(50),
    "fecha_inicio" DATE,
    "fecha_fin" DATE,
    "hora_inicio" VARCHAR(10),
    "hora_fin" VARCHAR(10),
    "duracion" VARCHAR(100),
    "costo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "color" VARCHAR(7) DEFAULT '#6366F1',
    "descripcion" TEXT,
    "total_horas" INTEGER,
    "instructor" VARCHAR(255),
    "contenido" TEXT,
    "requisitos_previos" TEXT,
    "enlace_whatsapp" VARCHAR(500),
    "afiche_url" VARCHAR(500),
    "afiche_public_id" VARCHAR(255),
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preinscripciones" (
    "id" SERIAL NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "nombres" VARCHAR(255) NOT NULL,
    "apellido_paterno" VARCHAR(255) NOT NULL,
    "apellido_materno" VARCHAR(255),
    "telefono" VARCHAR(50),
    "ci" VARCHAR(50),
    "institucion_estudios" VARCHAR(255),
    "observaciones" TEXT,
    "comprobante_url" VARCHAR(500),
    "comprobante_public_id" VARCHAR(255),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "preinscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_estados" (
    "id" SERIAL NOT NULL,
    "preinscripcion_id" INTEGER NOT NULL,
    "estado_anterior" VARCHAR(50),
    "estado_nuevo" VARCHAR(50) NOT NULL,
    "observacion" TEXT,
    "created_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_estados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "preinscripciones_curso_id_estado_idx" ON "preinscripciones"("curso_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "preinscripciones_correo_curso_id_key" ON "preinscripciones"("correo", "curso_id");

-- AddForeignKey
ALTER TABLE "preinscripciones" ADD CONSTRAINT "preinscripciones_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_estados" ADD CONSTRAINT "historial_estados_preinscripcion_id_fkey" FOREIGN KEY ("preinscripcion_id") REFERENCES "preinscripciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
