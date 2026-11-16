-- P8-01: office location and supervised courses existed only in Arabic, so the English UI showed
-- Arabic. Add English columns (NULL = fall back to Arabic). Demo profiles are filled by the dev
-- seeder; profiles auto-created for faculty get the standard English defaults here.
ALTER TABLE faculty_office_profile ADD COLUMN office_location_en VARCHAR(200);
ALTER TABLE faculty_office_profile ADD COLUMN supervised_courses_en VARCHAR(1000);

UPDATE faculty_office_profile
SET office_location_en = 'College building - Academic office',
    supervised_courses_en = 'Academic advising|Course discussions'
WHERE office_location = 'مبنى الكلية - مكتب أكاديمي'
  AND supervised_courses = 'الإرشاد الأكاديمي|مناقشة المقررات';
