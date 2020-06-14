SET client_encoding to utf8;
INSERT INTO thuvienbk_book VALUES
    (1, 'Artificial Intelligence', 'English', 'Prentice Hall', 2009, 9780714874746, 0.001, 4.0, 1, 5, 4),
    (2, 'Trí tuệ Nhân tạo = Thông minh + Giải thuật', 'Vietnamese', 'Nhà Xuất bản Đại học Quốc gia TP.HCM', 2008, 9780714873503, 0.12, 0.0, 0, 3, 4),
    (3, 'Parallel Programming: Techniques and Applications Using Networked Workstations and Parallel Computer', 'English', 'Prentice Hall', 2005, 9780593084342, 0.012, 0.0, 0, 6, 5),
    (4, 'Artificial Intelligence', 'English', 'Prentice Hall', 2020, 9781541768130, 0.06, 0.0, 0, 2, 4);

INSERT INTO thuvienbk_bookauthor VALUES
    (1, 'Stuart Russell'),
    (2, 'Peter Norvig') ,
    (3, 'Cao Hoàng Trụ'),
    (4, 'Barry Wilkinson'),
    (5, 'MiChael Allen');

INSERT INTO thuvienbk_book_authors VALUES
    (1, 1, 1),
    (2, 2, 3),
    (3, 3, 4),
    (4, 3, 5),
    (5, 4, 1),
    (6, 1, 2);

INSERT INTO thuvienbk_bookcategory VALUES
    (1, 'AI'),
    (4, 'ML'),
    (5, 'Parallel computing');

INSERT INTO thuvienbk_book_categories VALUES
    (2, 2, 1),
    (3, 2, 4),
    (4, 3, 5),
    (5, 4, 1),
    (6, 1, 1),
    (7, 1, 4);

INSERT INTO key_table VALUES
    (1, 9780714874746, '58094cc5-5c80-4964-8a78-b40d997a47f0'),
    (2, 9780714874746, 'bb9bf80d-8794-4ae4-9e38-795c030a2d23'),
    (3, 9780714874746, '00f94a2d-2752-44c5-90da-6dddce249bb5'),
    (4, 9780714874746, '40b45837-3790-429f-b1a6-501d807387f0'),
    (5, 9780714874746, '70179e96-619b-4fcf-af0e-b4de2902b174'),
    (6, 9780714873503, '0763b687-e018-45a1-b081-49b836e2a472'),
    (7, 9780714873503, '79f412ad-77a7-4dfd-b2c3-a2eeb2d42f34'),
    (8, 9780714873503, 'f394ada8-6348-448e-8e08-9041b006e514'),
    (9, 9780593084342, '508a7aa2-d0f5-492c-85df-0203edfc659b'),
    (10, 9780593084342, '77f3ae6b-7bde-49bb-81f4-4f097f7bd298'),
    (11, 9780593084342, '6bde779d-06fa-47d5-8924-e4bc6ed9a146'),
    (12, 9780593084342, '150baa90-792d-4b63-9baf-fb5c349acff6'),
    (13, 9780593084342, '31e471f8-4ba0-4647-a423-47f469260ec4'),
    (14, 9780593084342, '7c6b5bea-245d-457e-9ebb-a77f3dda98b8'),
    (15, 9781541768130, 'fbcd687b-2924-4d5d-a742-4508aec8db55'),
    (16, 9781541768130, 'cdc6d5b6-a5ae-11ea-a6f2-9840bb425430');
