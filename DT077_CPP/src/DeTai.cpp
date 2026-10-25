#include "../include/DeTai.h"
#include <iostream>
#include <algorithm>
#include <queue>
#include <set>

bool kiem_tra_dau_vao(int n, const std::vector<std::pair<int, int>>& canh, std::string& thong_bao_loi) {
    if (n < 1 || n > 100) {
        thong_bao_loi = "So dinh n phai thuoc doan [1, 100]. Nhan duoc: n = " + std::to_string(n);
        return false;
    }

    std::set<std::pair<int, int>> tap_canh;
    for (size_t i = 0; i < canh.size(); ++i) {
        int u = canh[i].first;
        int v = canh[i].second;

        if (u < 1 || u > n || v < 1 || v > n) {
            thong_bao_loi = "Dinh cua canh (" + std::to_string(u) + ", " + std::to_string(v) + ") nam ngoai mien [1, " + std::to_string(n) + "]";
            return false;
        }

        if (u == v) {
            thong_bao_loi = "Do thi don khong duoc chua canh khuyen tai dinh " + std::to_string(u);
            return false;
        }

        std::pair<int, int> canh_chuan = (u < v) ? std::make_pair(u, v) : std::make_pair(v, u);
        if (tap_canh.find(canh_chuan) != tap_canh.end()) {
            thong_bao_loi = "Canh giua dinh " + std::to_string(u) + " va " + std::to_string(v) + " bi lap lai hoac trung lap";
            return false;
        }
        tap_canh.insert(canh_chuan);
    }

    thong_bao_loi = "";
    return true;
}

std::vector<std::vector<int>> xay_dung_ke(int n, const std::vector<std::pair<int, int>>& canh) {
    std::vector<std::vector<int>> ke(n + 1);
    for (size_t i = 0; i < canh.size(); ++i) {
        int u = canh[i].first;
        int v = canh[i].second;
        ke[u].push_back(v);
        ke[v].push_back(u);
    }
    for (int u = 1; u <= n; ++u) {
        std::sort(ke[u].begin(), ke[u].end());
    }
    return ke;
}

std::vector<int> gan_nhom(const std::vector<std::vector<int>>& ke, int s, int ma, std::vector<int>& nhan) {
    std::vector<int> thanh_vien;
    std::queue<int> q;

    nhan[s] = ma;
    q.push(s);

    while (!q.empty()) {
        int u = q.front();
        q.pop();
        thanh_vien.push_back(u);

        for (size_t i = 0; i < ke[u].size(); ++i) {
            int v = ke[u][i];
            if (nhan[v] == 0) {
                nhan[v] = ma; // Đánh dấu ngay khi đưa vào hàng đợi
                q.push(v);
            }
        }
    }

    std::sort(thanh_vien.begin(), thanh_vien.end());
    return thanh_vien;
}

KetQuaThanhPhan thanh_phan(int n, const std::vector<std::pair<int, int>>& canh) {
    std::string loi;
    if (!kiem_tra_dau_vao(n, canh, loi)) {
        throw std::invalid_argument(loi);
    }

    std::vector<std::vector<int>> ke = xay_dung_ke(n, canh);
    std::vector<int> nhan(n + 1, 0);
    std::vector<std::vector<int>> danh_sach_nhom;
    int so_nhom = 0;

    for (int i = 1; i <= n; ++i) {
        if (nhan[i] == 0) {
            so_nhom++;
            std::vector<int> tv = gan_nhom(ke, i, so_nhom, nhan);
            danh_sach_nhom.push_back(tv);
        }
    }

    KetQuaThanhPhan kq;
    kq.so_nhom = so_nhom;
    kq.nhan = nhan;
    kq.danh_sach_nhom = danh_sach_nhom;
    return kq;
}

std::vector<int> tim_nhom_lon_nhat(const std::vector<std::vector<int>>& danh_sach_nhom) {
    if (danh_sach_nhom.empty()) {
        return std::vector<int>();
    }
    size_t best_idx = 0;
    size_t max_len = danh_sach_nhom[0].size();

    for (size_t i = 1; i < danh_sach_nhom.size(); ++i) {
        if (danh_sach_nhom[i].size() > max_len) {
            max_len = danh_sach_nhom[i].size();
            best_idx = i;
        }
    }
    return danh_sach_nhom[best_idx];
}

void in_nhom(const KetQuaThanhPhan& kq) {
    std::cout << "=========================================\n";
    std::cout << "KET QUA PHAN TICH THANH PHAN LIEN THONG:\n";
    std::cout << "- Tong so thanh phan lien thong: " << kq.so_nhom << "\n";
    std::cout << "- Ma nhom cua tung dinh (1..n):\n";
    for (size_t i = 1; i < kq.nhan.size(); ++i) {
        std::cout << "  Dinh " << i << " -> Nhom " << kq.nhan[i] << "\n";
    }
    std::cout << "- Liet ke thanh vien cac nhom:\n";
    for (size_t idx = 0; idx < kq.danh_sach_nhom.size(); ++idx) {
        std::cout << "  * Nhom " << (idx + 1) << " (kich thuoc " << kq.danh_sach_nhom[idx].size() << "): [";
        for (size_t j = 0; j < kq.danh_sach_nhom[idx].size(); ++j) {
            std::cout << kq.danh_sach_nhom[idx][j] << (j + 1 < kq.danh_sach_nhom[idx].size() ? ", " : "");
        }
        std::cout << "]\n";
    }
    std::vector<int> nhom_max = tim_nhom_lon_nhat(kq.danh_sach_nhom);
    std::cout << "- [Tuy chon] Nhom lon nhat (kich thuoc " << nhom_max.size() << "): [";
    for (size_t j = 0; j < nhom_max.size(); ++j) {
        std::cout << nhom_max[j] << (j + 1 < nhom_max.size() ? ", " : "");
    }
    std::cout << "]\n";
    std::cout << "=========================================\n";
}
