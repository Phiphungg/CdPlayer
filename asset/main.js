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

const PLAYER_STORAGE_KEY = "BECCA_PLAYER";

const btnPlay = $(".btn-toggle-play");
const playlist = $(".playlist");
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const cd = $(".cd");
const audio = $("#audio");
const progress = $(".progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Perfect",
      singer: "Ed Sheeran",
      path: "./Music/Ed Sheeran - Perfect.mp3",
      image: "https://i1.sndcdn.com/artworks-000240088107-9s5wcs-t500x500.jpg",
    },
    {
      name: "One Last Time",
      singer: "Ariana Grande",
      path: "./Music/One Last Time.mp3",
      image: "https://i1.sndcdn.com/artworks-000115250163-kc16dx-t500x500.jpg",
    },
    {
      name: "Strawberry and Cigarettes",
      singer: "Troye Sivan",
      path: "./Music/Strawberries & Cigarettes.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/b/b5/Strawberries_%26_Cigarettes_by_Troye_Sivan.png",
    },
    {
      name: "Enchanted ",
      singer: "Taylor Swift",
      path: "./Music/Taylor Swift - Enchanted.mp3",
      image: "https://i1.sndcdn.com/artworks-dLbp0C6C5v4U-0-t500x500.jpg",
    },
    {
      name: "Van Gogh",
      singer: "Dept Feat. Ashley Alisha",
      path: "./Music/Van Gogh - Dept Feat. Ashley Alisha.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/757px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    },
    {
      name: "One of the girls",
      singer: "Jennie & The Weekend & Lili Dept",
      path: "./Music/One of the girls.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2c/One_of_the_Girls_-_The_Weeknd%2C_Jennie%2C_%26_Lily-Rose_Depp.jpg",
    },
    {
      name: "Pano",
      singer: "Zack Tabudlo",
      path: "./Music/Zack Tabudlo - Pano.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2022/12/29/e/e/f/b/1672296333770_640.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index == this.currentIndex ? "active" : ""
        }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url(${song.image})">
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
    playlist.innerHTML = html.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  handleEvents: function () {
    const _this = this;
    // ScrollTop
    const cdWidth = cd.offsetWidth;

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // rotate cd
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Click play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    //Xử lý Event audio khi click play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    //seek (run normal)
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const percent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = percent;
      }
    };

    //seek
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // btn next
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.ScrollToActiveSong();
    };

    // btn prev
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
    };

    // btn random
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      btnRandom.classList.toggle("active", _this.isRandom);
    };

    // btn repeat
    btnRepeat.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      btnRepeat.classList.toggle("active", _this.isRepeat);
    };

    // next when audio is ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };

    // click song on playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Khi click vao song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          console.log(_this.currentIndex);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Khi click vao option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  ScrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 500);
  },

  start: function () {
    //load config
    this.loadConfig();

    // trang thai ban dau cua random va repeat
    btnRandom.classList.toggle("active", this.isRandom);
    btnRepeat.classList.toggle("active", this.isRepeat);

    // Load playlist
    this.render();

    // concept Obj
    this.defineProperties();

    //Load first song
    this.loadCurrentSong();

    // Events
    this.handleEvents();
  },
};

app.start();
