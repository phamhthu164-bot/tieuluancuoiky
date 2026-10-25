#ifndef DETAI_H
#define DETAI_H

#include <vector>
#include <utility>
#include <string>

// Cấu trúc lưu kết quả phân tích thành phần liên thông
struct KetQuaThanhPhan {
    int so_nhom;                                  // Tổng số thành phần liên thông
    std::vector<int> nhan;                        // nhan[i]: mã nhóm của đỉnh i (1..n)
    std::vector<std::vector<int>> danh_sach_nhom; // Danh sách các đỉnh trong từng nhóm (đã sắp xếp)
};

// Hàm kiểm tra tính hợp lệ của dữ liệu đầu vào theo hợp đồng phiếu giao
bool kiem_tra_dau_vao(int n, const std::vector<std::pair<int, int>>& canh, std::string& thong_bao_loi);

// Xây dựng danh sách kề vô hướng, các đỉnh kề được sắp xếp tăng dần
std::vector<std::vector<int>> xay_dung_ke(int n, const std::vector<std::pair<int, int>>& canh);

// Duyệt loang BFS từ đỉnh s, gán mã nhóm 'ma' cho các đỉnh cùng thành phần
std::vector<int> gan_nhom(const std::vector<std::vector<int>>& ke, int s, int ma, std::vector<int>& nhan);

// Chia toàn bộ đồ thị n đỉnh thành các thành phần liên thông
KetQuaThanhPhan thanh_phan(int n, const std::vector<std::pair<int, int>>& canh);

// Tìm thành phần có kích thước lớn nhất (hòa thì chọn nhóm có đỉnh nhỏ nhất)
std::vector<int> tim_nhom_lon_nhat(const std::vector<std::vector<int>>& danh_sach_nhom);

// In kết quả theo đúng định dạng chuẩn của phiếu đề tài
void in_nhom(const KetQuaThanhPhan& kq);

#endif // DETAI_H
