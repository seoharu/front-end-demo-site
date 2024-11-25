<template>
<!--  <nav>-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--  </nav>-->
  <router-view/>
</template>

<style>

body {
  margin: 0 !important;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #6B7C95;

  font-weight: 600;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #0B0C11;
}

nav a.router-link-exact-active {
  color: #283470;
}
</style>
