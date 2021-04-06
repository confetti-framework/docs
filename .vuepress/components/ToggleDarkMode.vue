<template>
<div class="dark-mode-widget">
    <input type="checkbox" id="theme-toggle" @click="toggleDarkTheme"></input>
    <label for="theme-toggle"><span></span></label>
</div>
</template>

<script>
export default {
mounted() {
    this.checkUserPreference();
},
methods: {
    toggleDarkTheme() {
    const body = document.body;
    body.classList.toggle("dark-mode");
    //If dark mode is selected
    if (body.classList.contains("dark-mode")) {
        //Save user preference in storage
        localStorage.setItem("dark-theme", "true");
    //If light mode is selected
    } else {
        body.classList.remove("dark-mode");
        setTimeout(function() {
          localStorage.removeItem("dark-theme");
        }, 100);
    }
    },
    checkUserPreference(){
        //Check Storage on Page load. Keep user preference through sessions
        if (localStorage.getItem("dark-theme")) {
            document.body.classList.add("dark-mode");
            document.getElementById('theme-toggle').checked = true;
        }
    }
}
};
</script>

<style>

body.dark-mode h1, body.dark-mode h2, body.dark-mode h3, body.dark-mode p, .dark-mode a, .dark-mode .navbar .site-name, .dark-mode a.sidebar-link.active, body.dark-mode .home .feature p {
    color: #f1f1f1;
}

body.dark-mode .home .feature h2 {
    color: #6a8bad
}

body.dark-mode a.sidebar-link:hover {
    color: #6a8bad;
}

body.dark-mode code {
    color: #a7d3ff;
}


body.dark-mode, .dark-mode .navbar, .dark-mode .navbar .links, .dark-mode aside.sidebar, .dark-mode .page {
  background-color: rgb(47, 47, 47);
  border-color: rgb(120, 114, 103);
  color: rgb(175, 184, 189);
}
.dark-mode .search-box input {
    background: #07a7b81c url(/assets/img/search.83621669.svg) 0.6rem 0.5rem no-repeat;
}

.dark-mode div[class*="language-"] .highlight-lines .highlighted {
    background-color: #0c3d3f;
}





.dark-mode-widget {
    float: right;
    margin-top: -3em;
}

.home .dark-mode-widget {
    float: auto;
    display: table;
    margin: 2em auto;
}

#theme-toggle {
    display: none;
}
#theme-toggle + label {
    font-size: 1.5rem;
    display: flex;
    width: 2em;
    border-radius: 2em;
    background-size: auto 8em;
    background-position: bottom;
    background-image: linear-gradient(180deg, #00383d 0%, #20206A 19%, #029aa8 66%, #62E7F7 100%);
    transition: .2s;
    cursor: pointer;
    border: 0.025em solid #eef3f6;
    overflow: hidden;
}
#theme-toggle + label span {
    background: #fffad8;
    border-radius: 50%;
    height: .7em;
    width: .7em;
    transform: translateX(-.62.5em) scale(.65);
    transition: .2s;
    cursor: pointer;
    box-shadow: 0 0 .25em .0625em #fbee8d, 0 0 2em 0 #FFEB3B, inset -.25em -.25em 0 0 #fbee8e, inset -.3125em -.3125em 0 .625em #fff5b2;
    margin-top: -.125em;
    margin: .2em;
}
#theme-toggle:checked {
    font-size: 10rem;
}
#theme-toggle:checked + label {
    background-position: top;
    border-color: #5983a6;
}
#theme-toggle:checked + label span {
    background: transparent;
    transform: translateX(calc(100%)) scale(.65);
    box-shadow: inset -.1875em -.1875em 0 0 #fbe7ef, inset -.2625em -.2625em 0 0 #fffff7;
}

</style>
