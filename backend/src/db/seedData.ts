export const DELETE_PREVIOUS_DATA = `DELETE FROM sessions;DELETE FROM students; DELETE FROM interviews;`;

export const PUT_STUDENT_DATA = `
    INSERT INTO students (first_name,last_name,batch)
    VALUES
        ('Emily', 'Stone', '1'),
        ('Megan', 'Weaver', '1'),
        ('Sarah', 'Zamora', '2'),
        ('Elizabeth', 'Anderson', '2'),
        ('Catherine', 'Brewer', '2'),
        ('James', 'Hale', '3'),
        ('Bailey', 'Woods', '3'),
        ('Paul', 'Murphy', '3'),
        ('Brianna', 'Murphy', '3'),
        ('Selena', 'Hatfield', '4'),
        ('Jessica', 'Turner', '4'),
        ('Kim', 'Jones', '4'),
        ('Kelly', 'Davis', '5'),
        ('Melissa', 'James', '5'),
        ('Bradley', 'Keller', '5'),
        ('Vanessa', 'Thompson', '5'),
        ('Christina', 'Kelley', '6'),
        ('Scott', 'Anderson', '6'),
        ('Michelle', 'Peterson', '6'),
        ('Justin', 'Price', '6');
    `;

export const PUT_INTERVIEWS_DATA = `
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1688148878);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1692536224);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1681590796);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1681361259);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1685623662);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Netflix','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1691173803);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Apple','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1683881482);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Wipro','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1684751444);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Infosys','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1686540952);
    INSERT INTO interviews (company_name,interview_name,description,time) values('TechMahindra','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1693269408);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1684069417);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1686366544);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1682560398);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1686971936);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1685087503);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Netflix','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1689334265);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Apple','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1686082820);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Wipro','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1688546871);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Infosys','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1686868564);
    INSERT INTO interviews (company_name,interview_name,description,time) values('TechMahindra','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1684511578);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1686957015);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1687427448);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1686149659);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1684271124);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1689558129);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Netflix','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1681567531);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Apple','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1681348403);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Wipro','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1688338284);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Infosys','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1689267513);
    INSERT INTO interviews (company_name,interview_name,description,time) values('TechMahindra','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1688045730);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1680986824);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1683884790);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1683920762);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1681557988);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1680400471);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Netflix','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1691988891);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Apple','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1686371821);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Wipro','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1690364394);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Infosys','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1690977374);
    INSERT INTO interviews (company_name,interview_name,description,time) values('TechMahindra','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1685625996);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1685735736);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1681968667);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1690857719);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1681922900);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1686822832);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Netflix','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1688166459);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Apple','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1680791395);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Wipro','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1682379174);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Infosys','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1682442246);
    INSERT INTO interviews (company_name,interview_name,description,time) values('TechMahindra','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1681971369);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Google','Web Developer','Create UI and navigation menus, write and review codes for HTML, XML or JavaScript, test web applications, troubleshoot problems, and collaborate with designers, developers, and stakeholders.',1680986824);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Microsoft','Software Developer','Review current systems, develop ideas for improving systems, work closely with data analysts, designers, and staff, write program codes, test the product before going live, prepare training manuals for users, and maintain systems once they start running.',1683884790);
    INSERT INTO interviews (company_name,interview_name,description,time) values('CodingNinjas','Backend Developer','Create and maintain technology at the back end of a website, test and debug the entire back end, etc.',1683920762);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Scaler','Front End Developer','Develop new UI features, determine structure and design of web pages, build reusable codes, optimize page loading times, etc.',1681557988);
    INSERT INTO interviews (company_name,interview_name,description,time) values('Facebook','Full Stack Developer','Develop front-end, design back-end of the application, create database and servers, API development, meet technical and consumer needs, etc.',1680400471);
`;

export const PUT_SESSIONS_DATA = `
INSERT INTO sessions (student_id,interview_id,interview_status)
VALUES
    ('50','68','CLEARED'),
    ('48','64','DISQUALIFIED'),
    ('45','106','NO_ATTEMPT'),
    ('57','69','CLEARED'),
    ('39','89','CLEARED'),
    ('49','88','FAILED'),
    ('50','97','ON_HOLD'),
    ('53','114','DISQUALIFIED'),
    ('43','90','FAILED'),
    ('55','89','CLEARED'),
    ('53','76','NO_ATTEMPT'),
    ('49','84','ON_HOLD'),
    ('57','109','NO_ATTEMPT'),
    ('53','95','DISQUALIFIED'),
    ('41','94','ON_HOLD'),
    ('44','61','FAILED'),
    ('48','73','ON_HOLD'),
    ('41','111','ON_HOLD'),
    ('38','98','ON_HOLD'),
    ('49','102','FAILED'),
    ('38','108','ON_HOLD'),
    ('39','95','DISQUALIFIED'),
    ('50','112','ON_HOLD'),
    ('56','96','FAILED'),
    ('53','114','FAILED'),
    ('51','82','CLEARED'),
    ('39','76','FAILED'),
    ('38','74','NO_ATTEMPT'),
    ('53','83','CLEARED'),
    ('44','110','CLEARED'),
    ('42','104','FAILED'),
    ('54','109','NO_ATTEMPT'),
    ('51','84','ON_HOLD'),
    ('51','101','NO_ATTEMPT'),
    ('48','82','CLEARED'),
    ('44','109','FAILED'),
    ('43','92','DISQUALIFIED'),
    ('38','92','ON_HOLD'),
    ('43','97','ON_HOLD'),
    ('49','66','DISQUALIFIED'),
    ('53','110','DISQUALIFIED'),
    ('55','79','DISQUALIFIED'),
    ('41','90','NO_ATTEMPT'),
    ('53','61','ON_HOLD'),
    ('53','104','NO_ATTEMPT'),
    ('51','84','FAILED'),
    ('53','73','ON_HOLD'),
    ('56','108','CLEARED'),
    ('50','85','CLEARED'),
    ('47','98','CLEARED');
`;