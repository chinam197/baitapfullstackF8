import { client } from "./client.js";
import { config } from "./config.js";
const { SERVER_API_AUTH } = config;

client.setUrl(SERVER_API_AUTH);

const app = {
  root: document.querySelector("#root"),
  isLogin: function () {
    const status = localStorage.getItem("token_user") ? true : false;

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
      } else if (button.innerText === "Đăng ký") {
        button.innerHTML = `Đăng ký`;
        button.disabled = false;
      } else {
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
      let accessToken = token.data.accessToken;
      let refreshToken = token.data.refreshToken;
      
      localStorage.setItem("token_user",JSON.stringify({accessToken,refreshToken}));
      localStorage.setItem("login_token", JSON.stringify(token));
      this.getProfile();
      this.infinityScroll();
      //Render
      this.render();
    } catch (e) {
      this.showError(e.message);
      this.logout();
    }

  }
  ,
//   regex :function(content){
//   let div = document.createElement("div");

//     let handleRegexPhone = function(){
//      let pattern = /(?:\+84|0)\d{9,11}/;
//      return pattern.
     
//     }
    
//     let handleRegexLink = function(){

//     }
//     let handleRegexYtb = function(){

//     }





// }
// ,
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
          const dateObject = new Date(timeUp);
          // this.regex(content);
          const patternLink =
            /^(http|https):\/\/([a-z0-9][a-z0-9-_\.]*\.|)[a-z0-9][a-z0-9-_\.]*\.[a-z]{2,}(:\d{2,}|)(\/*|\/[^\s]+)$/;
          const patternMail = /^[\w\.-]{3,}@[\w\.-]{1,}\.[a-z]{2,}$/;
          const patternPhone = /^(?:\+84|0)\d{9,11}$/;

          let append = "";
          content.trim();
          if (patternLink.test(content)) {
            let iframe = document.createElement("iframe");
            let embed = "https://www.youtube.com/embed/";
            let pattern1 = /^(?:https:\/\/www\.youtube\.com\/watch\?v=)/;
            let pattern2 = /^(?:https:\/\/youtu\.be\/)/;

            iframe.style.height = "360px";
            iframe.style.width = "100%";
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "true");
            iframe.allow =
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

            if (pattern1.test(content)) {
              content = content.replace(pattern1, embed);
            } else {
              content = content.replace(pattern2, embed);
            }

            iframe.src = `${content}`;

            append = iframe.outerHTML;
          } else if (patternMail.test(content)) {
            let mail = document.createElement("a");
            mail.href = "mailto:" + `${content}`;
            mail.target = "_blank";
            mail.innerText = content;
            append = mail.outerHTML;
          } else if (patternPhone.test(content)) {
            let numberPhone = document.createElement("a");
            numberPhone.href = "tel:" + `${content}`;
            numberPhone.target = "_blank";
            numberPhone.innerText = content;
           

            append = numberPhone.outerHTML;
          } else {
            let paragraph = document.createElement("p");
            paragraph.innerText = content;
            append = paragraph.innerText;
          }

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
     <li>${this.stripHtml(name)}</li>
     <li>${formattedTime}</li>
    </ul>
    </div>
    
    <div class="setting col-1">x</div>
    <p>${this.stripHtml(title)}</p>
     </div>
     <div class="row user-post">
    ${append}
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
           this.render();
    }
  },
  getProfile: async function () { 
    let accessToken;
    try {
      let token = localStorage.getItem("token_user");
     
      if (token) {
        accessToken = JSON.parse(token).accessToken;       
      }

      if (!accessToken) {
        throw new Error("accessToken not null");
      }
      client.setToken(accessToken);
      const { response, data: user } = await client.get("/users/profile");
      if(response.status === 401){
       this.refreshToken(this.getProfile);
      return;
      } 
      if (!response.ok) {
       this.refreshToken( this.getProfile);
        return;
      }
      this.root.querySelector("ul .name").innerText = user.data.name;
      this.root.querySelector(".profile ul li h5").innerText = user.data.name;
      this.getPost();
      
     
    } catch (e) {
      
    }
  },
  logout: async function () {
    let token = localStorage.getItem("token_user");
      let accessToken;
      if (token) {
        accessToken = JSON.parse(token).accessToken;
      }
    try{
      client.setToken(accessToken);
      const { response, data } = await client.post("/auth/logout");
      if(response.status === 401){
        localStorage.removeItem("token_user");
        localStorage.removeItem("posts_user");
        localStorage.removeItem("login_token");
        this.render();
      }
     if(response.ok){
     localStorage.removeItem("token_user");
      localStorage.removeItem("posts_user");
      localStorage.removeItem("login_token");
      this.render();
     }

      
       
    }catch(e){
      
      localStorage.removeItem("token_user");
      localStorage.removeItem("posts_user");
      localStorage.removeItem("login_token");
      this.render();
    }
    

     

     
  },
  page_Limit: {
    page: 1,
    limit: 10,
  },
  postNew: async function (value) {
    
    try{
      this.loading(true, "btn-outline-info");
    const { response, data: blog } = await client.post("/blogs", value);
   
    let accessTokenUser = localStorage.getItem("token_user");
    let accessToken = null;
    
   if(accessTokenUser){
   accessToken = JSON.parse(accessTokenUser).accessToken;
   }
   
 if (response.ok) {
      this.loading(false, "btn-outline-info");
      this.getPost();
      this.getProfile();
      this.render();
    }
     if(!response.ok) {
     await this.refreshToken(this.getProfile);
      this.render();  
    }

    }catch(e){

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

  refreshToken: async function (callback=()=>{}) {

    try {
      let userData = localStorage.getItem("token_user");
      let refreshToken=null;
    if(userData){
      refreshToken = JSON.parse(userData).refreshToken;
    }
      
      const { response, data: newToken } = await client.post(
        "/auth/refresh-token",
        {
          refreshToken,
        }
      );    
      if (!response.ok) {
      callback();
      this.getPost();
      this.render();
      }
    
      const jsonToken = JSON.stringify(newToken.data.token);
      
      localStorage.setItem("token_user", jsonToken);
      callback();
      this.getPost();
      this.getProfile();
      this.render();
      if (refreshToken) {
        const accessToken = newToken.data.token.accessToken;
        client.setToken(accessToken);
      }
    } catch (error) {
     this.logout();
    }
  },
message:function(){
  let div = document.createElement("div");
  div.innerHTML = `<div class="notification">
<div class="message">Hello</div>
<div class="title">đã đăng xuất thành công</div>
</div>`;
document.body.prepend(div);
}
  ,

  start: function () {
    //Khởi động ứng dụng
    this.render();
    this.addEvent();
    this.getProfile();
    this.infinityScroll();
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
