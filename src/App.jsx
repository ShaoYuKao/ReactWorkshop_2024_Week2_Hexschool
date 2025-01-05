import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Loading from "react-fullscreen-loading";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "202501-react-shaoyu";

function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); // 登入表單資料
  const [isAuth, setIsAuth] = useState(false);  // 是否為管理員
  const [products, setProducts] = useState([]); // 產品列表
  const [tempProduct, setTempProduct] = useState(null); // 單一產品細節
  const [isLoading, setIsLoading] = useState(false); // 是否載入中
  const [pagination, setPagination] = useState({
    "total_pages": 1,
    "has_pre": false,
    "has_next": false,
    "category": ""
  }); // 分頁資訊
  const [currentGroup, setCurrentGroup] = useState(0); // 目前群組索引
  const [currentPage, setCurrentPage] = useState(1); // 目前頁數

  useEffect(() => {
    if (getToken()) {
      checkAdmin();
    }
  }, []);

  useEffect(() => {
    if (isAuth) {
      fetchProducts();
    }
  }, [isAuth]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);
  
  /**
   * 檢查使用者是否為管理員。
   *
   * @param {string} token - 用於驗證的使用者 Token。
   * @returns {Promise<void>} - 不返回任何值的 Promise。
   */
  const checkAdmin = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);

    const url = `${API_BASE}/api/user/check`;
    axios.defaults.headers.common.Authorization = token;

    try {
      const res = await axios.post(url);
      const { success } = res.data;
      if (!success) {
        throw new Error("使用者驗證失敗");
      }
      setIsAuth(true);
    } catch (error) {
      console.error("使用者驗證失敗", error);
      clearToken();
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 處理輸入變更事件的函式。
   *
   * @param {Object} e - 事件對象。
   * @param {string} e.target.id - 觸發事件的元素的 ID。
   * @param {string} e.target.value - 觸發事件的元素的值。
   */
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  /**
   * 使用者點擊[登入]按鈕，處理表單提交的異步函數。
   * @param {Event} e - 表單提交事件。
   * @returns {Promise<void>} - 無返回值的 Promise。
   * @throws 會在登入失敗時拋出錯誤。
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;

      // 寫入 cookie token
      // expires 設置有效時間
      document.cookie = `hexToken=${token};expires=${new Date(
        expired
      )}; path=/`;

      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
    } catch (error) {
      console.error("登入失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 從伺服器獲取產品資料並更新狀態。
   * @async
   * @function fetchProducts
   * @returns {Promise<void>} 無返回值。
   * @throws 取得產品資料失敗時拋出錯誤。
   */
  const fetchProducts = async () => {
    if (!isAuth) return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${currentPage}`
      );
      const { total_pages, current_page, has_pre, has_next, category } = response.data.pagination;
      setPagination({
        ...pagination,
        total_pages: total_pages,
        // current_page: current_page,
        has_pre: has_pre,
        has_next: has_next,
        category: category
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("取得產品資料失敗", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 執行登出操作的非同步函式。
   * 
   * 此函式會向伺服器發送登出請求，並根據伺服器回應的結果進行處理。
   * 如果登出成功，會清除瀏覽器中的 cookie 並更新認證狀態。
   * 如果登出失敗，會在控制台顯示錯誤訊息。
   * 
   * @async
   * @function logout
   * @throws {Error} 如果伺服器回應登出失敗，會拋出錯誤。
   */
  const logout = async () => {
    setIsLoading(true);
    const url = `${API_BASE}/logout`;

    try {
      const res = await axios.post(url);
      const { success, message } = res.data;
      if (!success) {
        throw new Error(message);
      }
    } catch (error) {
      console.error("登出失敗", error);
    } finally {
      axios.defaults.headers.common["Authorization"] = undefined;
      clearToken();
      setIsAuth(false);
      setFormData({
        username: "",
        password: "",
      });
      setIsLoading(false);
    }
  };

  /**
   * 取得 Cookie 中的 hexToken
   * @returns {string|null} 返回 Token 字串，如果不存在則返回 null
   */
  const getToken = () => {
    // 取出 Token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    return token || null;
  };

  /**
   * 清除 Token
   * 此函式會將名為 "hexToken" 的 cookie 設定為過期，從而達到清除 Token 的效果。
   */
  const clearToken = () => {
    // 清除 Token
    document.cookie = "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // === 頁數群組 start ===
  // 每個群組包含的頁數，預設設定為 5
  const pagesPerGroup = 5;

  // 計算總共有多少個群組數
  const totalGroups = Math.ceil(pagination.total_pages / pagesPerGroup);

  /**
   * 處理下一個群組的邏輯。
   * 如果目前的群組索引小於總群組數減一，則將目前的群組索引加一。
   */
  const handleNext = () => {
    if (currentGroup < totalGroups - 1) {
      setCurrentGroup(currentGroup + 1);
    }

    const newCurrentPage = currentPage + 1;
    if (newCurrentPage <= pagination.total_pages) {
      setCurrentPage(newCurrentPage);
    }
  };

  /**
   * 處理上一組的邏輯。
   * 如果 currentGroup 大於 0，則將 currentGroup 減 1。
   */
  const handlePrevious = () => {
    if (currentGroup > 0) {
      setCurrentGroup(currentGroup - 1);
    }

    const newCurrentPage = currentPage - 1;
    if (newCurrentPage > 0) {
      setCurrentPage(newCurrentPage);
    }
  };
  // === 頁數群組 end ===

  return (
    <>
      <Loading loading={isLoading} background="rgba(46, 204, 113, 0.5)" loaderColor="#3498db" />
      {isAuth ? (
        <>
          <div className="container mt-3">
            <button 
              type="button" 
              className="btn btn-outline-secondary d-block ms-auto"
              onClick={logout}
            >登出</button>
          </div>

          <div className="container text-center">
            <div className="row mt-5">
              <div className="col-md-6">
                <h2>產品列表</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>是否啟用</th>
                      <th>查看細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products && products.length > 0 ? (
                      products.map((item) => (
                        <tr key={item.id}>
                          <td>{item.title}</td>
                          <td>{item.origin_price}</td>
                          <td>{item.price}</td>
                          <td>{item.is_enabled ? "啟用" : "未啟用"}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => setTempProduct(item)}
                            >
                              查看細節
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">尚無產品資料</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* 分頁 (Pagination) */}
                { pagination.total_pages > 1 && (
                  <div className="d-flex justify-content-end">
                    <nav aria-label="Page navigation">
                      <ul className="pagination">
                        <li className={"page-item " + (pagination.has_pre ? "" : "disabled")}>
                          <a className="page-link" href="#" aria-label="Previous" onClick={handlePrevious}>
                            <span aria-hidden="true">&laquo;</span>
                          </a>
                        </li>

                        {[...Array(pagesPerGroup)].map((_, index) => {
                          const pageNumber = currentGroup * pagesPerGroup + index + 1;
                          if (pageNumber > pagination.total_pages) return null;
                          return (
                            <li 
                              className={"page-item " + (currentPage === Number(pageNumber) ? "active" : "") } 
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              <a className="page-link" href="#">{pageNumber}</a>
                            </li>
                          );
                        })}
                      
                        <li className={"page-item " + (pagination.has_next ? "" : "disabled")}>
                          <a className="page-link" href="#" aria-label="Next" onClick={handleNext} >
                            <span aria-hidden="true">&raquo;</span>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                )}

              </div>
              <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct ? (
                  <div className="card mb-3">
                    <img
                      src={tempProduct.imageUrl}
                      className="card-img-top primary-image"
                      alt="主圖"
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {tempProduct.title}
                        <span className="badge bg-primary ms-2">
                          {tempProduct.category}
                        </span>
                      </h5>
                      <p className="card-text">
                        商品描述：{tempProduct.category}
                      </p>
                      <p className="card-text">商品內容：{tempProduct.content}</p>
                      <div className="d-flex">
                        <p className="card-text text-secondary">
                          <del>{tempProduct.origin_price}</del>
                        </p>
                        元 / {tempProduct.price} 元
                      </div>
                      <h5 className="mt-3">更多圖片：</h5>
                      <div className="d-flex flex-wrap">
                        {tempProduct.imagesUrl?.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            className="images m-2"
                            alt="副圖"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary">請選擇一個商品查看</p>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
    </>
  );
}

export default App;
