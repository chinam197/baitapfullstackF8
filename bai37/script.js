import { client } from "./client.js";
import { config } from "./config.js";
const { SERVER_API_AUTH } = config;

client.setUrl(SERVER_API_AUTH);

const app = {
  root: document.querySelector("#root"),
  isLogin: function () {
    const status = localStorage.getItem("login_token") ? true : false;

    return status;
  },
  stripHtml: (html) => html.replace(/(<([^>]+)>)/gi, ""),

  render: function () {
    if (this.isLogin()) {
      this.insideApp();
      // this.getProfile();
    } else {
      this.signInHtml();
    }
  },
  signUpHtml: function () {
    let html = `<div class="row justify-content-center">
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
    <button class="sign-in link-secondary">Sign In</button>`;
    this.root.innerHTML = html;
    document.querySelector(".sign-in").addEventListener("click", () => {
      this.signInHtml();
      return;
    });
  },
  signInHtml: function () {
    let html = `<div class="row justify-content-center">
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
    this.root.innerHTML = html;
    document.querySelector(".sign-up").addEventListener("click", () => {
      this.signUpHtml();
      return;
    });
  },
  insideApp: function () {
    let html = ` <div class="row">
      <header class="nav-bar-left col-3">
         <div class="profile">
          <ul class="profile">
                <li class="avartar"><a href="#"><img src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-cho-con-de-thuong-chay-tung-tang-1-24-11-43-28.jpg" alt="avt"></a></li>
                <li><h5></h5></li>
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
                  <input type="date" class="time">
              </div>
   <button class="submit btn btn-outline-info">Write New!</button>
          </form>
         
          
      </div>
      </header>

        <main class="container-posts col-6">
          
           
             
        </main>
        <footer class="nav-bar-right col-3">
        <ul class="profile list-unstyled d-flex gap-3">
          <li>Chào bạn: <span class="name"></span></li>
          <li><a href="#" class="text-decoration-none logout">Đăng xuất</a></li>
        </ul>
        </footer>
      </div>`;
    this.root.innerHTML = html;
    this.root.addEventListener("click", (e) => {
      if (e.target.classList.contains("logout")) {
        e.preventDefault();
        this.logout();
      }
    });
  },
  addEvent: function () {
    let _this = this;
    this.root.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.target.classList.contains("login")) {
        const emailEl = e.target.querySelector(".email");
        const passwordEl = e.target.querySelector(".password");

        const email = emailEl.value;
        const password = passwordEl.value;

        _this.login({ email, password });
        emailEl.value = "";
        passwordEl.value = "";
      } else if (e.target.classList.contains("signUp")) {
        const emailEl = e.target.querySelector(".new-email");
        const passwordEl = e.target.querySelector(".new-password");
        const nameEl = e.target.querySelector(".new-name");

        const name = nameEl.value;
        const email = emailEl.value;
        const password = passwordEl.value;

        _this.signUp({ name, email, password });
        nameEl.value = "";
        emailEl.value = "";
        passwordEl.value = "";
      } else {
        const titleEl = document.querySelector(".title");
        const contentEl = document.querySelector(".content");

        let content = contentEl.value;
        let title = titleEl.value;

        this.postNew({ title, content });
        titleEl.value = "";
        contentEl.value = "";
      }
    });
  },
  loading: function (status = true, btn = "") {
    const button = this.root.querySelector(".btn");

    if (status) {
      button.innerHTML = `<span class="spinner-border spinner-border-sm"></span> Loading...`;
      button.disabled = true;
    } else {
      if (button.innerText === "Đăng nhập") {
        button.innerHTML = `Đăng nhập`;
        button.disabled = false;
      } else if(button.innerText === "Đăng ký"){
        button.innerHTML = `Đăng ký`;
        button.disabled = false;
      }else{
        button.innerHTML = `Write New`;
        button.disabled = false;
      }
    }
  },
  showError: function (msgText) {
    const msg = this.root.querySelector(".text-danger");
    msg.innerText = ``;
    msg.innerText = msgText;
  },
  signUp: async function (data) {
    this.loading(true, "btn-new-account");
    const { response } = await client.post("/auth/register", data);
    try {
      if (!response.ok) {
        throw new Error("Error signUp");
      }

      this.showError("Đăng Ký thành công ><");
      this.loading(false);
      this.isLogin();
      this.render();
      document.querySelector(".email").value = data.email;
    } catch (e) {
      if (e.message) {
        this.showError("error signUp");
      }
    }
  },

  login: async function (data) {
    this.loading(); //Thêm loading

    try {
      //Call API
      const { response, data: token } = await client.post("/auth/login", data);

      this.loading(false); //Xóa loading
      if (!response.ok) {
        throw new Error("Email hoặc mật khẩu không hợp lệ");
      }
      //Thêm token vào Storage (localStorage)
      localStorage.setItem("login_token", JSON.stringify(token));
      this.getProfile();
      this.infinityScroll();
      //Render
      this.render();
    } catch (e) {
      this.showError(e.message);
      this.logout();
    }
  },
  getPost: async function (pages) {
    try {
      let page = "?page=1&limit=10";
      if (pages) {
        page = "?" + pages;
      }
      const { response, data: user } = await client.get(`/blogs${page}`);
      const { data } = user;
      localStorage.setItem("posts_user", JSON.stringify(data));

      let users = localStorage.getItem("posts_user");
      users = JSON.parse(users);
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu");
      }
      if (response.ok) {
        users.forEach((item) => {
          let { content, title, userId, timeUp } = item;
          let { name } = userId;
          content = this.stripHtml(content);
          title = this.stripHtml(title);
          name = this.stripHtml(name);

          const dateObject = new Date(timeUp);

          // Lấy thông tin ngày, tháng, năm, giờ, phút và giây từ đối tượng Date
          const year = dateObject.getFullYear();
          const month = dateObject.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần cộng thêm 1
          const day = dateObject.getDate();
          const hour = dateObject.getHours();
          const minute = dateObject.getMinutes();
          const second = dateObject.getSeconds();

          // Định dạng lại thời gian theo định dạng bạn muốn
          const formattedTime = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
          let section = document.createElement("section");
          section.classList.add("col-12");
          section.classList.add("boder-post");

          section.innerHTML = `<div class="user-info row">
    <div class="col-11 flex-avartar">
     <div class="avartar">
         <a href="#"><img src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-cho-con-de-thuong-chay-tung-tang-1-24-11-43-28.jpg" alt="img">
         </a>
     </div>
    
    <ul>
     <li>${name}</li>
     <li>${formattedTime}</li>
    </ul>
    </div>
    
    <div class="setting col-1">x</div>
    <p>${title}</p>
     </div>
    <img src="https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-cho-con-de-thuong-chay-tung-tang-1-24-11-43-28.jpg" alt="img">
     <div class="row user-post">
        
     </div>
     <div class="client-commenting">
         <ul class="row">
             <li class="col-4"><i class="fa-solid fa-heart text-center"></i></li>
             <li class="col-4"><i class="fa-solid fa-comment text-center"></i></li>
             <li class="col-4"><i class="fa-solid fa-share text-center" ></i></li>
         </ul>
     </div>`;
          this.root.querySelector(".container-posts").append(section);
          let hr = document.createElement("hr");
          this.root.querySelector(".container-posts").append(hr);
        });
      }
    } catch (e) {
      this.root.innerHTML = `<div class="spinner-border m-5 Loading_background" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
    }
  },
  getProfile: async function () {
    try {
      let token = localStorage.getItem("login_token");
      let accessToken=null;
      if (token) {
        accessToken = JSON.parse(token).data.accessToken;
      }

      if (!accessToken){
        throw new Error("accessToken not null");
      }
      client.setToken(accessToken);
      const { response, data: user } = await client.get("/users/profile");
      this.root.querySelector("ul .name").innerText = user.data.name;
      this.root.querySelector(".profile ul li h5").innerText = user.data.name;
      this.getPost();
      if(response.status===401){
        this.refreshToken(accessToken, this.getProfile);
        return;
      }

      if (!response.ok) {
        this.refreshToken(accessToken, this.getProfile);
        return;
      }
    } catch (e) {
      if (e.message) {
      
      }
    }
  },
  logout: function () {
    // const { response } =client.post("/auth/logout", {});
    localStorage.removeItem("login_token");
    localStorage.removeItem("posts_user");
    this.render();
  },
  page_Limit: {
    page: 1,
    limit: 10,
  },
  postNew: async function (value) {
    this.loading(true, "btn-outline-info");
    const { response, data: blog } = await client.post("/blogs", value);
    let accessTokenUser = localStorage.getItem("login_token");
    let accessToken = null;
    if(accessTokenUser){
      accessToken = localStorage.parse(accessTokenUser).data.accessToken;
    }
    if(!accessToken){
      accessToken = client.setToken;
    localStorage.setItem("login_token",{
      accessToken : accessToken
    });
      
    }
    if(response.ok){
    this.loading(false, "btn-outline-info");

    }else{

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
        _this.page_Limit.page++;
        let page = new URLSearchParams(_this.page_Limit);
        page = page.toString();
        _this.getPost(page);
        _this.checkScroll = false;
      }
    });
  },

  refreshToken: async function (refreshToken,callback=()=>{}) {
     
      const { response, data: newToken } = await client.post(
        "/auth/refresh-token",
        {
          accessToken : refreshToken,
        }
        
      );
      console.log(newToken);
      
     
  },

  start: function () {
    //Khởi động ứng dụng
    this.render();
    this.addEvent();
    this.getProfile();
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
