import { client } from "./client.js";
import { config } from "./config.js";
const { PAGE_LIMIT } = config;
const { SERVER_API } = config;
const socialNetwork = {
  rootEl: document.querySelector(".container"),

  render: function (user) {
    const stripHTML = (html) => html.replaceAll(/(<([^>]+)>)/gi, "");
    this.rootEl.innerHTML = `
    ${user
      .map(
({ name = "", title = "", img = "" }) => `
    <div class="wrapper">
    <div class="flex-user">
        <ul class="user">
            <li class="avatar"><a href="#"><img src="${stripHTML(
              img
            )}" class="avatar"></a></li>
            <li>
                <ul class="post">
                    
                    <li><h3>${stripHTML(name)}</h3></li>
                    <li>17thang10 luc 11:36</li>
                    <li><i class="fa-solid fa-earth-americas"></i></li>
                </ul>
            </li>
            
        </ul>
       
        <ul class="ul-setting">
            <li><i class="fa-solid fa-ellipsis"></i></li>
            <li><i class="fa-solid fa-xmark"></i></li>
        </ul>
    </div>
    <p>${stripHTML(title)}</p>
</div>

<div class="picture">
    <img src="${img}" alt="img">
</div>
<div>

</div>
    <hr>
    `
      )
      .join("")}`;
  },
  getUser: async function (page) {
    let usersLength = await client.get("/users");
    if (page === usersLength.data.length - 1) {
      page = a.data.length;
    }
    const params = new URLSearchParams({ _limit: page });

    const url = `https://svgncf-8080.csb.app/users?${params.toString()}`;

    const response = await fetch(url);
    const data = await response.json();
    this.render(data);
  },
  infinityScroll(page) {
    window.addEventListener("scroll", () => {
      if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
        page+=5;
        this.getUser(page);
      }
    });
  },
  start: function () {
    let page = 10;

    this.getUser(page);
    this.infinityScroll(page);
  },
};
socialNetwork.start();
