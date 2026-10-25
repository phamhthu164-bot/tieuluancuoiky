# DT077 — ĐẾM VÀ LIỆT KÊ CÁC THÀNH PHẦN LIÊN THÔNG

## 1. Thông tin sinh viên và đề tài
- **Họ và tên**: Phạm Huỳnh Thư
- **Mã số sinh viên (MSSV)**: N24DCDT091
- **Lớp**: D24CQDT01-N
- **Mã đề tài**: DT077
- **Học phần**: Cấu trúc dữ liệu và Giải thuật (INT13185) — Nhóm 03
- **Giảng viên hướng dẫn**: ThS. Hồ Nhựt Minh
- **Ngôn ngữ cài đặt**: C++ (Chuẩn C++11 trở lên, trình biên dịch MinGW GCC 6.3.0)
- **Giáo trình căn cứ**: INT1306, Chương 6, Bài 6.1; Bài tập 25; trang in 145, 159; trang PDF 157, 171.

## 2. Cấu trúc thư mục mã nguồn
```
DT077_CPP/
├── include/
│   └── DeTai.h             # Tệp tiêu đề: khai báo kiểu dữ liệu, hàm kiểm tra và hàm giải
├── src/
│   └── DeTai.cpp           # Triển khai thuật toán BFS gán nhóm, danh sách kề, kiểm tra đầu vào
├── demo.cpp                # Chương trình chạy minh họa 2 ví dụ phiếu, 5 ca kiểm tra, validator
├── test_detai.cpp          # Bộ kiểm thử tự động 12 ca kiểm độc lập (50 assertions)
├── docs/
│   └── anh_ket_qua/        # Thư mục chứa 11 ảnh minh chứng A01 - A11
├── build_and_run.bat       # Script biên dịch và chạy toàn bộ demo + test
└── README.md               # Hướng dẫn chi tiết
```

## 3. Lệnh biên dịch và chạy chương trình

### 3.1. Biên dịch bằng g++ (MinGW):
```powershell
g++ -std=c++11 -Wall -O2 src/DeTai.cpp demo.cpp -o demo.exe
g++ -std=c++11 -Wall -O2 src/DeTai.cpp test_detai.cpp -o test_detai.exe
```

### 3.2. Lệnh chạy minh họa (demo):
```powershell
.\demo.exe
```

### 3.3. Lệnh chạy bộ kiểm thử (test suite):
```powershell
.\test_detai.exe
```

## 4. Kết quả kiểm thử thực tế
- Số ca kiểm thử độc lập: **12 / 12 ca ĐẠT (PASS 100%)**
- Số phép kiểm tra (assertions): **50 / 50 ĐẠT**
- Không có lỗi rò rỉ bộ nhớ, đáp ứng đầy đủ yêu cầu phiếu giao đề tài DT077.
