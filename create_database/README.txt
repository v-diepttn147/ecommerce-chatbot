Cài đặt postgresql

Mở terminal nhập lần lượt các lệnh:

1. psql -U postgres
Sau đó postgresql sẽ yêu cầu password, nhập password để đăng nhập với user postgres

1.1. \cd create_database

2. \i createDb.sql
Tạo database có tên SampleDatabase

3. \c sampledatabase
Chỉ định các lệnh sau sẽ thực thi trên SampleDatabase vừa tạo.
Trong trường hợp không chỉ định database, thì khi thực hiện 1 lệnh sql trên database, postgresql sẽ thực hiện trên database mặc định là postgres

4. \i createTable.sql
Tạo các bảng trống

5. \i insertSampleValues.sql
Thêm 1 vài giá trị ví dụ vào database
