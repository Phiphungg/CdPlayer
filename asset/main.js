// 1. 1.Render songs
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / prev
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const cd = $(".cd");

const app = {
  songs: [
    {
      name: "Perfect",
      singer: "Ed Sheeran",
      path: "/MusicPlayer/Music/Ed Sheeran - Perfect.mp3",
      image: "https://i1.sndcdn.com/artworks-000240088107-9s5wcs-t500x500.jpg",
    },
    {
      name: "One Last Time",
      singer: "Ariana Grande",
      path: "/MusicPlayer/Music/One Last Time.mp3",
      image: "https://i1.sndcdn.com/artworks-000115250163-kc16dx-t500x500.jpg",
    },
    {
      name: "Strawberry and Cigarettes",
      singer: "Troye Sivan",
      path: "/MusicPlayer/Music/Strawberries & Cigarettes.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/b5/Strawberries_%26_Cigarettes_by_Troye_Sivan.png",
    },
    {
      name: "Enchanted ",
      singer: "Taylor Swift",
      path: "/MusicPlayer/Music/Taylor Swift - Enchanted.mp3",
      image: "https://i1.sndcdn.com/artworks-dLbp0C6C5v4U-0-t500x500.jpg",
    },
    {
      name: "Van Gogh",
      singer: "Dept Feat. Ashley Alisha",
      path: "/MusicPlayer/Music/Van Gogh - Dept Feat. Ashley Alisha.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/757px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    },
    {
      name: "One of the girls",
      singer: "Jennie & The Weekend & Lili Dept",
      path: "/MusicPlayer/Music/One of the girls.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2c/One_of_the_Girls_-_The_Weeknd%2C_Jennie%2C_%26_Lily-Rose_Depp.jpg",
    },
    {
      name: "Pano",
      singer: "Zack Tabudlo",
      path: "/MusicPlayer/Music/Zack Tabudlo - Pano.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2022/12/29/e/e/f/b/1672296333770_640.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song) => {
      return `
        <div class="song">
          <div class="thumb"
            style="background-image: url('${song.image}'">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>    
        </div>
      `;
    });
    playlist.innerHTML = htmls.join("");
  },

  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };
  },

  start: function () {
    this.render();
    this.handleEvents();
  },
};

app.start();
