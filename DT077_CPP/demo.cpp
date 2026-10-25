#include "include/DeTai.h"
#include <iostream>
#include <vector>
#include <utility>

void chay_ca_mau(const std::string& ten_ca, int n, const std::vector<std::pair<int, int>>& canh) {
    std::cout << "\n==================================================\n";
    std::cout << ">>> " << ten_ca << "\n";
    std::cout << "Dau vao: n = " << n << ", so canh = " << canh.size() << "\nCac canh: [";
    for (size_t i = 0; i < canh.size(); ++i) {
        std::cout << "(" << canh[i].first << ", " << canh[i].second << ")" << (i + 1 < canh.size() ? ", " : "");
    }
    std::cout << "]\n";

    try {
        KetQuaThanhPhan kq = thanh_phan(n, canh);
        in_nhom(kq);
    } catch (const std::exception& ex) {
        std::cerr << "Loi: " << ex.what() << "\n";
    }
}

int main(int argc, char* argv[]) {
    std::cout << "*****************************************************************\n";
    std::cout << "* DE TAI DT077: DEM VA LIET KE CAC THANH PHAN LIEN THONG        *\n";
    std::cout << "* Sinh vien thuc hien: Pham Huynh Thu - MSSV: N24DCDT091        *\n";
    std::cout << "* Lop: D24CQDT01-N - Hoc phan: INT13185 (Nhom 03)               *\n";
    std::cout << "* Giang vien huong dan: Ho Nhut Minh                            *\n";
    std::cout << "*****************************************************************\n";

    // 1. Chạy Ví dụ 1 trên phiếu giao
    chay_ca_mau("VI DU 1 (Tren phieu giao): n = 5, canh = [(1,2), (3,4)]", 
                5, {{1, 2}, {3, 4}});

    // 2. Chạy Ví dụ 2 trên phiếu giao
    chay_ca_mau("VI DU 2 (Tren phieu giao): n = 3, canh = [(1,2), (2,3), (1,3)]", 
                3, {{1, 2}, {2, 3}, {1, 3}});

    // 3. Chạy 5 ca kiểm tra trên phiếu
    chay_ca_mau("CA KIEM 1 TREN PHIEU: n = 1, khong canh", 
                1, {});

    chay_ca_mau("CA KIEM 2 TREN PHIEU: n = 4, khong canh (4 dinh co lap)", 
                4, {});

    chay_ca_mau("CA KIEM 3 TREN PHIEU: Duong di 1-2-3-4", 
                4, {{1, 2}, {2, 3}, {3, 4}});

    chay_ca_mau("CA KIEM 4 TREN PHIEU: Canh 1-3 va 2-4", 
                4, {{1, 3}, {2, 4}});

    chay_ca_mau("CA KIEM 5 TREN PHIEU: n = 6, tam giac 1,2,3 va canh 4-5", 
                6, {{1, 2}, {2, 3}, {1, 3}, {4, 5}});

    // 4. Kiểm tra phản hồi của validator khi gặp input không hợp lệ
    std::cout << "\n==================================================\n";
    std::cout << ">>> THU NGHIEM KIEM TRA DAU VAO (VALIDATOR - LOI01)\n";
    std::string err;
    int n_loi = 4;
    std::vector<std::pair<int, int>> canh_loi = {{1, 5}}; // Đỉnh 5 vượt ngoài [1, 4]
    std::cout << "Thu input loi: n = 4, canh = [(1, 5)]\n";
    if (!kiem_tra_dau_vao(n_loi, canh_loi, err)) {
        std::cout << "[PASS VALIDATOR] Tu choi hop le: " << err << "\n";
    } else {
        std::cout << "[FAIL] Khong phat hien duoc loi!\n";
    }

    return 0;
}
