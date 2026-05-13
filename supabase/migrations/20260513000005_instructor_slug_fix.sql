-- Slug'ları 8 karakter yerine 12 karakterle yeniden üret (çakışma riski sıfır)
UPDATE instructors
SET slug = generate_instructor_slug(full_name)
        || '-'
        || right(replace(id::text, '-', ''), 12);
