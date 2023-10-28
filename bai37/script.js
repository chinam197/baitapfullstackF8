import { client } from "./client.js";
import { config } from "./config.js";
const { SERVER_API_AUTH } = config;

client.setUrl(SERVER_API_AUTH);

const app = {
  root: document.querySelector("#root"),
  PageLimit: {
    page: 1,
    limit: 10,
  },

  isLogin: function () {
    console.log(1);

    const status = localStorage.getItem("login") ? true : false;
    return status;
  },

  checkLoging: true,

  render: function (data = { name: "" }) {
    console.log(2);

    let _this = this;
    let html;
    if (this.isLogin()) {
      html = ` <div class="row">
      <header class="nav-bar-left col-3">
         <div class="profile">
          <ul class="profile">
                <li class="avartar"><a href="#"><img src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-cho-con-de-thuong-chay-tung-tang-1-24-11-43-28.jpg" alt="avt"></a></li>
                <li><h5>${data.name}</h5></li>
          </ul>      
         </div>
      <div class="post">
          <form action="" class="news">
              <div class="wrapper wrapper-title">
                  <label for="title">Enter Your Title</label>
          <input name="title" class="title" type="text"  placeholder="...">
              </div>
              <div class="wrapper wrapper-content">
                  <label for="content">Enter Your Content</label>
                  <textarea name="content" class="content _textarea_10xkb_1 border content" cols="30" rows="10"></textarea>
              </div>
  
              <div class="wrapper wrapper-time">
                  <label for="time">Set time to posts!</label>
                  <input type="text" class="time">
              </div>
   <button class="submit btn btn-outline-info">Write New!</button>
          </form>
         
          
      </div>
      </header>

        <main class="container-posts col-6">
          
           
             
        </main>
        <footer class="nav-bar-right col-3">
        <ul class="profile list-unstyled d-flex gap-3">
          <li>Chào bạn: <span class="name">${data.name}</span></li>
          <li><a href="#" class="text-decoration-none logout">Đăng xuất</a></li>
        </ul>
        </footer>
      </div>`;
    } else if (this.checkLoging) {
      html = `<div class="row justify-content-center">
      <div class="col-8 col-lg-6">
        <h2 class="text-center">Đăng nhập</h2>
        <form action="" class="login">
          <div class="mb-3">
            <label for="">Email</label>
            <input type="email" name="email" class="form-control email" placeholder="Email..." required/>
          </div>
          <div class="mb-3">
            <label for="">Password</label>
            <input type="password" name="password" class="form-control password" placeholder="Password..." required/>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary">Đăng nhập</button>
          </div>
          <div class="msg mt-3 text-danger text-center"></div>
        </form>
        <button class="sign-up link-secondary">Sign Up</button>
      </div>`;
    } else {
      html = `<div class="row justify-content-center">
        <div class="col-8 col-lg-6">
          <h2 class="text-center">Đăng ký</h2>
          <form action="" class="signUp">
            <div class="mb-3">
                <label for="new-name"></label>
                <input type="text" name="new-name" class="form-control new-name" placeholder="Please enter the Name" required/>
              </div>
            <div class="mb-3">
              <label for="new-email">Email</label>
              <input type="email" name="new-email" class="form-control new-email" placeholder="Please enter the Email" required/>
            </div>
            <div class="mb-3">
              <label for="new-password">Password</label>
              <input type="password" name="new-password"  class="form-control new-password" placeholder="Please enter the Password" required/>
            </div>
            <div class="d-grid">
              <button class="btn btn-primary btn-new-account">Đăng ký</button>
            </div>
            <div class="msg mt-3 text-danger text-center"></div>
          </form>
          <button class="sign-in link-secondary">Sign In</button>
        `;
    }

    this.root.innerHTML = html;
    this.btnSignIn = document
      .querySelector(".sign-up")
      ?.addEventListener("click", () => {
        console.log(3);

        _this.checkLoging = false;
        _this.render();
      });
    this.btnSignUp = document
      .querySelector(".sign-in")
      ?.addEventListener("click", () => {
        console.log(4);

        _this.checkLoging = true;
        _this.render();
      });
  },
  addEvent: function () {
    console.log(5);

    let _this = this;
    this.root.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("login")) {
        const emailEl = e.target.querySelector(".email");
        const passwordEl = e.target.querySelector(".password");

        const email = emailEl.value;
        const password = passwordEl.value;

        _this.login({ email, password });
      }
      if (e.target.classList.contains("signUp")) {
        //
        const createNameEl = e.target.querySelector(".new-name");
        const createEmailEl = e.target.querySelector(".new-email");
        const createPasswordEl = e.target.querySelector(".new-password");

        // lay value dang ky
        const name = createNameEl.value;
        const email = createEmailEl.value;
        const password = createPasswordEl.value;

        _this.signUp({ name, email, password });

        createEmailEl.value = "";
        createNameEl.value = "";
        createPasswordEl.value = "";
      }
      if (e.target.classList.contains("news")) {
        const titleEL = e.target.querySelector(".title");
        const contentEl = e.target.querySelector(".content");
        const timeValueEl = e.target.querySelector(".time");

        const title = titleEL.value;
        const content = contentEl.value;
        _this.postNews({ title, content });
        titleEL.value = "";
        contentEl.value = "";
        timeValueEl.value = "";
      }
    });

    this.root.addEventListener("click", (e) => {
      if (e.target.classList.contains("logout")) {
        e.preventDefault();
        this.logout();
      }
    });
  },
  loading: function (status = true, btn = "") {
    console.log(6);

    const button = this.root.querySelector(".btn");

    if (status) {
      button.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Loading...`;
      button.disabled = true;
    } else {
      if (button.innerText === "Đăng nhập") {
        button.innerHTML = `Đăng nhập`;
        button.disabled = false;
      } else {
        button.innerHTML = `Đăng ký`;
        button.disabled = false;
      }
    }
  },
  showError: function (msgText) {
    const msg = this.root.querySelector(".login .msg");
    msg.innerText = ``;
    msg.innerText = msgText;
  },
  signUp: async function (data) {
    this.loading(true, "btn-new-account");
    try {
      const { response, data: token } = await client.post(
        "/auth/register",
        data
      );
      this.loading(false);

      if (!response.ok) {
        throw new Error("Tài khoản đã tồn tại");
      }
    } catch (e) {
      this.showError(e.message);
    }
  },

  login: async function (data) {
    this.loading(true, "btn"); //Thêm loading
    try {
      //Call API
      const { response, data: token } = await client.post("/auth/login", data);
      this.loading(false); //Xóa loading
      if (!response.ok) {
        throw new Error("Email hoặc mật khẩu không hợp lệ");
      }
      //Thêm token vào Storage (localStorage)
      localStorage.setItem("login", JSON.stringify(token));
      this.getUsers();
      this.getProfile();
      //Render

      this.render();
    } catch (e) {
      console.log("hello");
      this.showError(e.message);
    }
  },
  getProfile: async function () {
    try {
      let token = localStorage.getItem("login");

      let accessToken;
      let refreshToken;
      if (token) {
        const { data } = JSON.parse(token);
        accessToken = data.accessToken;
        refreshToken = data.refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("accessToken", accessToken);
      }

      if (!accessToken) {
        throw new Error("accessToken not null");
      }

      client.setToken(accessToken);

      const { response } = await client.get("/users/profile");

      if (!response.ok) {
      }
      let user = localStorage.getItem("login");
      const { data } = JSON.parse(user);
      this.render(data);
    } catch (e) {
      if (e.message) {
        this.logout();
      }
    }
  },
  logout: function () {
    localStorage.removeItem("login");
    localStorage.removeItem("Users_post");
    this.render();
  },
  getUsers: async function (page) {
    console.log(12);

    if (!page) {
      page = "";
    } else {
      page = "?" + page;
    }
    const { response, data: user } = await client.get(`/blogs${page}`);
    try {
      let users;
      if (!response.ok) {
        throw new Error("resource get failed");
      } else {
        const { data } = user;
        localStorage.setItem("Users_post", JSON.stringify(data));

        users = localStorage.getItem("Users_post");
        if (users) {
          users = JSON.parse(users);

          let innerPosts = document.querySelector(".container-posts");

          users.forEach((item) => {
            const {
              title,
              content,
              timeUp,
              userId: { name },
            } = item;

            let div = document.createElement("div");
            div.classList.add("row");
            div.innerHTML = `
 <section class="col-12 boder-post">
  <div class="user-info row">
 <div class="col-11 flex-avartar">
  <div class="avartar">
      <a href="#"><img src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-cho-con-de-thuong-chay-tung-tang-1-24-11-43-28.jpg" alt="img"></a>
  </div>

 <ul>
  <li>${name}</li>
  <li>${timeUp}</li>
 </ul>
 </div>

 <div class="setting col-1">x</div>
                
  </div>

  <div class="row user-post">
     <p>${content}</p>
  </div>
  <div class="client-commenting">
      <ul class="row">
          <li class="col-4"><i class="fa-solid fa-heart text-center"></i></li>
          <li class="col-4"><i class="fa-solid fa-comment text-center"></i></li>
          <li class="col-4"><i class="fa-solid fa-share text-center" ></i></li>
      </ul>
  </div>
</section>
<hr>
 `;
            innerPosts.appendChild(div);
          });
        }
      }
    } catch (e) {
      if (e.message) {
        this.logout();
      }
    }
  },
  postNews: async function (data) {
    let { response } = await client.post("/blogs", data);
    try {
      if (!response.ok) {
        throw new Error("Error post");
      }
      this.getUsers();
      this.render();
    } catch (e) {
      console.log("");
    }
  },

  checkScroll: true,
  infinityScroll: function () {
    let _this = this;

    window.addEventListener("scroll", () => {
      if (
        window.scrollY + window.innerHeight + 0.5 >=
        document.body.offsetHeight
      ) {
        _this.PageLimit.page++;
        let page = new URLSearchParams(_this.PageLimit);
        page = page.toString();
        _this.getUsers(page);
        _this.checkScroll = false;
      }
    });
  },

  start: function () {
    this.render();
    this.addEvent();
    this.getUsers();
    this.getProfile();
    this.infinityScroll();
    this.postNews();
  },
};

app.start();

/*
request -> accessToken chưa hết hạn -> ok
request -> accessToken hết hạn -> failed
Giải pháp: 
- request lấy lại accessToken (Dựa vào refresh)
- Lưu accessToken mới vào storage
- Gọi lại request bị failed
*/

//Promise, Async Await, Closure
//interceptors
