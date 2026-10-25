#include "include/DeTai.h"
#include <iostream>
#include <vector>
#include <cassert>
#include <numeric>

int total_asserts = 0;
int passed_asserts = 0;
int total_cases = 12;
int passed_cases = 0;

#define RUN_TEST(name, func) do { \
    std::cout << "[RUNNING] " << name << " ... "; \
    bool ok = func(); \
    if (ok) { \
        std::cout << "PASS\n"; \
        passed_cases++; \
    } else { \
        std::cout << "FAIL\n"; \
    } \
} while (0)

#define CHECK(cond) do { \
    total_asserts++; \
    if (cond) { \
        passed_asserts++; \
    } else { \
        std::cerr << "\nAssertion failed at line " << __LINE__ << ": " << #cond << "\n"; \
        return false; \
    } \
} while (0)

// VD01: Ví dụ 1 phiếu giao (n=5, 2 cạnh)
bool test_VD01() {
    KetQuaThanhPhan kq = thanh_phan(5, {{1, 2}, {3, 4}});
    CHECK(kq.so_nhom == 3);
    CHECK(kq.danh_sach_nhom.size() == 3);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 2}));
    CHECK(kq.danh_sach_nhom[1] == std::vector<int>({3, 4}));
    CHECK(kq.danh_sach_nhom[2] == std::vector<int>({5}));
    CHECK(kq.nhan[1] == 1 && kq.nhan[2] == 1);
    CHECK(kq.nhan[3] == 2 && kq.nhan[4] == 2);
    CHECK(kq.nhan[5] == 3);
    return true;
}

// VD02: Ví dụ 2 phiếu giao (n=3, tam giác)
bool test_VD02() {
    KetQuaThanhPhan kq = thanh_phan(3, {{1, 2}, {2, 3}, {1, 3}});
    CHECK(kq.so_nhom == 1);
    CHECK(kq.danh_sach_nhom.size() == 1);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 2, 3}));
    CHECK(kq.nhan[1] == 1 && kq.nhan[2] == 1 && kq.nhan[3] == 1);
    return true;
}

// TK01: Đồ thị đầy đủ K5 (10 cạnh)
bool test_TK01() {
    std::vector<std::pair<int, int>> canh;
    for (int i = 1; i <= 5; ++i) {
        for (int j = i + 1; j <= 5; ++j) {
            canh.push_back({i, j});
        }
    }
    KetQuaThanhPhan kq = thanh_phan(5, canh);
    CHECK(kq.so_nhom == 1);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 2, 3, 4, 5}));
    return true;
}

// TK02: Đồ thị hình sao 6 đỉnh (đỉnh 1 nối 2,3,4,5,6)
bool test_TK02() {
    KetQuaThanhPhan kq = thanh_phan(6, {{1, 2}, {1, 3}, {1, 4}, {1, 5}, {1, 6}});
    CHECK(kq.so_nhom == 1);
    CHECK(kq.danh_sach_nhom[0].size() == 6);
    return true;
}

// BIEN01: Ca biên 1 (n=1, không cạnh)
bool test_BIEN01() {
    KetQuaThanhPhan kq = thanh_phan(1, {});
    CHECK(kq.so_nhom == 1);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1}));
    CHECK(kq.nhan[1] == 1);
    return true;
}

// BIEN02: Ca biên 2 (n=4, không cạnh - 4 đỉnh cô lập)
bool test_BIEN02() {
    KetQuaThanhPhan kq = thanh_phan(4, {});
    CHECK(kq.so_nhom == 4);
    CHECK(kq.danh_sach_nhom.size() == 4);
    for (int i = 0; i < 4; ++i) {
        CHECK(kq.danh_sach_nhom[i] == std::vector<int>({i + 1}));
        CHECK(kq.nhan[i + 1] == (i + 1));
    }
    return true;
}

// BIEN03: Ca biên 3 (n=6: tam giác 1,2,3; cạnh 4-5; đỉnh 6 cô lập)
bool test_BIEN03() {
    KetQuaThanhPhan kq = thanh_phan(6, {{1, 2}, {2, 3}, {1, 3}, {4, 5}});
    CHECK(kq.so_nhom == 3);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 2, 3}));
    CHECK(kq.danh_sach_nhom[1] == std::vector<int>({4, 5}));
    CHECK(kq.danh_sach_nhom[2] == std::vector<int>({6}));
    return true;
}

// LOI01: Validator phát hiện đầu vào không hợp lệ
bool test_LOI01() {
    std::string err;
    CHECK(!kiem_tra_dau_vao(0, {}, err));                  // n < 1
    CHECK(!kiem_tra_dau_vao(105, {}, err));                // n > 100
    CHECK(!kiem_tra_dau_vao(4, {{1, 5}}, err));            // đỉnh 5 > n=4
    CHECK(!kiem_tra_dau_vao(3, {{2, 2}}, err));            // khuyên
    CHECK(!kiem_tra_dau_vao(3, {{1, 2}, {2, 1}}, err));    // cạnh lặp đảo
    return true;
}

// KT09: Ca phiếu 3 (Đường đi 1-2-3-4)
bool test_KT09() {
    KetQuaThanhPhan kq = thanh_phan(4, {{1, 2}, {2, 3}, {3, 4}});
    CHECK(kq.so_nhom == 1);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 2, 3, 4}));
    return true;
}

// KT10: Ca phiếu 4 (Cạnh 1-3 và 2-4)
bool test_KT10() {
    KetQuaThanhPhan kq = thanh_phan(4, {{1, 3}, {2, 4}});
    CHECK(kq.so_nhom == 2);
    CHECK(kq.danh_sach_nhom[0] == std::vector<int>({1, 3}));
    CHECK(kq.danh_sach_nhom[1] == std::vector<int>({2, 4}));
    return true;
}

// KT11: Bất biến toán học (Hai đầu mỗi cạnh cùng nhóm, tổng đỉnh bằng n)
bool test_KT11() {
    std::vector<std::pair<int, int>> canh = {{1, 3}, {3, 5}, {2, 4}, {6, 7}};
    int n = 8;
    KetQuaThanhPhan kq = thanh_phan(n, canh);
    for (size_t i = 0; i < canh.size(); ++i) {
        int u = canh[i].first;
        int v = canh[i].second;
        CHECK(kq.nhan[u] == kq.nhan[v]);
    }
    int tong_dinh = 0;
    for (size_t i = 0; i < kq.danh_sach_nhom.size(); ++i) {
        tong_dinh += kq.danh_sach_nhom[i].size();
    }
    CHECK(tong_dinh == n);
    return true;
}

// KT12: Yêu cầu mở rộng (Tìm nhóm lớn nhất)
bool test_KT12() {
    KetQuaThanhPhan kq = thanh_phan(7, {{1, 2}, {3, 4}, {4, 5}, {6, 7}});
    std::vector<int> max_grp = tim_nhom_lon_nhat(kq.danh_sach_nhom);
    CHECK(max_grp == std::vector<int>({3, 4, 5}));
    CHECK(max_grp.size() == 3);
    return true;
}

int main() {
    std::cout << "========================================================\n";
    std::cout << "BO KIEM THU TU DONG DE TAI DT077 (12 CA KIEM DOC LAP)\n";
    std::cout << "========================================================\n";

    RUN_TEST("TC01 (VD01 - Vi du 1)", test_VD01);
    RUN_TEST("TC02 (VD02 - Vi du 2)", test_VD02);
    RUN_TEST("TC03 (TK01 - Do thi day du K5)", test_TK01);
    RUN_TEST("TC04 (TK02 - Do thi hinh sao)", test_TK02);
    RUN_TEST("TC05 (BIEN01 - n=1 khong canh)", test_BIEN01);
    RUN_TEST("TC06 (BIEN02 - n=4 khong canh)", test_BIEN02);
    RUN_TEST("TC07 (BIEN03 - Tam giac va co lap)", test_BIEN03);
    RUN_TEST("TC08 (LOI01 - Validator 5 loi input)", test_LOI01);
    RUN_TEST("TC09 (KT09 - Duong di 1-2-3-4)", test_KT09);
    RUN_TEST("TC10 (KT10 - Canh 1-3 va 2-4)", test_KT10);
    RUN_TEST("TC11 (KT11 - Kiem tra bat bien toan hoc)", test_KT11);
    RUN_TEST("TC12 (KT12 - Tim nhom lon nhat)", test_KT12);

    std::cout << "========================================================\n";
    std::cout << "TONG KET KIEM THU:\n";
    std::cout << "- So ca kiem thu doc lap dat: " << passed_cases << " / " << total_cases << " ca\n";
    std::cout << "- So phep kiem tra (assertions) dat: " << passed_asserts << " / " << total_asserts << "\n";
    if (passed_cases == total_cases) {
        std::cout << "KET LUAN: TAT CA CAC CA KIEM THU DEU DAT (PASS 100%)\n";
    } else {
        std::cout << "KET LUAN: CO CA KIEM THU THAT BAI!\n";
    }
    std::cout << "========================================================\n";

    return (passed_cases == total_cases) ? 0 : 1;
}
