"use strict";(self["webpackChunkwsd02"]=self["webpackChunkwsd02"]||[]).push([[624],{8890:function(e,a,t){t.d(a,{$:function(){return o}});t(8992),t(670);var l=t(144),s=t(6768),n=t(4373);function o(){const e=(0,l.KR)([]),a=(0,l.KR)(!1),t=(0,l.KR)(null),o=(0,l.KR)(0),i=(0,l.KR)(0),r=(0,l.KR)(1),u=localStorage.getItem("TMDb-Key"),c=n.A.create({baseURL:"https://api.themoviedb.org/3",params:{api_key:u,language:"ko-KR"}}),v=async(l=1)=>{a.value=!0,t.value=null;try{const a=await c.get("/movie/popular",{params:{page:l}});if(a.data)return e.value=a.data.results,o.value=a.data.total_pages,i.value=a.data.total_results,r.value=l,console.log("Fetched page:",l,{currentPage:r.value,totalPages:o.value,hasMore:b.value,moviesCount:e.value.length}),a.data}catch(s){throw console.error("Error fetching movies:",s),t.value=s instanceof Error?s.message:"영화 정보를 불러오는데 실패했습니다.",s}finally{a.value=!1}},d=async(l=5)=>{a.value=!0;try{const a=Array.from({length:l},((e,a)=>c.get("/movie/popular",{params:{page:a+1}}))),t=await Promise.all(a),s=t.flatMap((e=>e.data.results));return e.value=s,o.value=Math.ceil(s.length/20),i.value=s.length,r.value=1,s}catch(s){return t.value=s instanceof Error?s.message:"영화 정보를 불러오는데 실패했습니다.",console.error("Error fetching movies for table view:",s),[]}finally{a.value=!1}},g=a=>{const t=20,l=(a-1)*t,s=l+t;return e.value.slice(l,s)},p=async(l=r.value+1)=>{if(!(a.value||l>o.value)){a.value=!0;try{const a=await c.get("/movie/popular",{params:{page:l}});a.data&&(e.value=[...e.value,...a.data.results],o.value=a.data.total_pages,i.value=a.data.total_results,r.value=a.data.page)}catch(s){t.value=s instanceof Error?s.message:"추가 영화 정보를 불러오는데 실패했습니다.",console.error("Error loading more movies:",s)}finally{a.value=!1}}},h=async(l,s=1)=>{a.value=!0;try{const a=await c.get("/discover/movie",{params:{with_genres:l,page:s,sort_by:"popularity.desc"}});a.data&&(e.value=a.data.results,o.value=a.data.total_pages,i.value=a.data.total_results,r.value=s)}catch(n){t.value=n instanceof Error?n.message:"장르별 영화를 불러오는데 실패했습니다.",console.error("Error filtering movies by genre:",n)}finally{a.value=!1}},f=async(l,s=1)=>{if(l.trim()){a.value=!0;try{const a=await c.get("/search/movie",{params:{query:l,page:s}});a.data&&(e.value=a.data.results,o.value=a.data.total_pages,i.value=a.data.total_results,r.value=s)}catch(n){t.value=n instanceof Error?n.message:"영화 검색에 실패했습니다.",console.error("Error searching movies:",n)}finally{a.value=!1}}},m=async e=>{a.value=!0;try{const a=await c.get(`/movie/${e}`);return a.data}catch(l){return t.value=l instanceof Error?l.message:"영화 상세 정보를 불러오는데 실패했습니다.",console.error("Error fetching movie details:",l),null}finally{a.value=!1}},k=()=>{e.value=[],r.value=1,o.value=0,i.value=0,t.value=null},b=(0,s.EW)((()=>r.value<o.value)),w=(0,s.EW)((()=>0===e.value.length));return{movies:e,loading:a,error:t,currentPage:r,totalPages:o,totalResults:i,fetchPopularMovies:v,loadMoreMovies:p,filterMoviesByGenre:h,searchMovies:f,getMovieDetails:m,resetMovies:k,fetchMoviesForTableView:d,getMoviesForPage:g,hasMore:b,isEmpty:w}}},9409:function(e,a,t){t.d(a,{A:function(){return d}});t(4114);var l=t(6768),s=t(4232);const n={class:"flex items-center justify-center gap-2 my-4"},o={key:2,class:"px-2"},i=["onClick"],r={key:3,class:"px-2"};var u={__name:"PaginationNav",props:{currentPage:{type:Number,required:!0},totalPages:{type:Number,required:!0},visiblePages:{type:Number,default:5}},emits:["page-change"],setup(e,{emit:a}){const t=e,u=a,c=(0,l.EW)((()=>{const e=Math.floor(t.visiblePages/2);let a=t.currentPage-e;return a<1&&(a=1),a+t.visiblePages-1>t.totalPages&&(a=Math.max(1,t.totalPages-t.visiblePages+1)),a})),v=(0,l.EW)((()=>Math.min(c.value+t.visiblePages-1,t.totalPages))),d=(0,l.EW)((()=>{const e=[];for(let a=c.value;a<=v.value;a++)e.push(a);return e})),g=(0,l.EW)((()=>c.value>1)),p=(0,l.EW)((()=>v.value<t.totalPages)),h=e=>{e!==t.currentPage&&e>=1&&e<=t.totalPages&&u("page-change",e)};return(a,t)=>((0,l.uX)(),(0,l.CE)("div",n,[g.value?((0,l.uX)(),(0,l.CE)("button",{key:0,onClick:t[0]||(t[0]=e=>h(c.value-1)),class:"pagination-button","aria-label":"이전 페이지 그룹"},t[4]||(t[4]=[(0,l.Lk)("i",{class:"fas fa-chevron-left"},null,-1)]))):(0,l.Q3)("",!0),c.value>1?((0,l.uX)(),(0,l.CE)("button",{key:1,onClick:t[1]||(t[1]=e=>h(1)),class:"pagination-button"}," 1 ")):(0,l.Q3)("",!0),c.value>2?((0,l.uX)(),(0,l.CE)("span",o,"...")):(0,l.Q3)("",!0),((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(d.value,(a=>((0,l.uX)(),(0,l.CE)("button",{key:a,onClick:e=>h(a),class:(0,s.C4)(["pagination-button",{"bg-blue-500 text-white":a===e.currentPage}])},(0,s.v_)(a),11,i)))),128)),v.value<e.totalPages-1?((0,l.uX)(),(0,l.CE)("span",r,"...")):(0,l.Q3)("",!0),v.value<e.totalPages?((0,l.uX)(),(0,l.CE)("button",{key:4,onClick:t[2]||(t[2]=a=>h(e.totalPages)),class:"pagination-button"},(0,s.v_)(e.totalPages),1)):(0,l.Q3)("",!0),p.value?((0,l.uX)(),(0,l.CE)("button",{key:5,onClick:t[3]||(t[3]=e=>h(v.value+1)),class:"pagination-button","aria-label":"다음 페이지 그룹"},t[5]||(t[5]=[(0,l.Lk)("i",{class:"fas fa-chevron-right"},null,-1)]))):(0,l.Q3)("",!0)]))}},c=t(1241);const v=(0,c.A)(u,[["__scopeId","data-v-22a6a870"]]);var d=v},6885:function(e,a,t){t.d(a,{A:function(){return E}});var l=t(6768),s=t(144),n=t(5130),o=t(4232),i=t(3289),r=t(8890),u=t(4907);const c={class:"infinite-scroll-view"},v={class:"movie-grid"},d={class:"action-buttons-container"},g=["onClick"],p=["src","alt"],h={class:"poster-info"},f={class:"release-date"},m={class:"overview"},k={key:1,class:"loading-container"},b={key:2,class:"end-message"};var w={__name:"InfiniteScrollView",emits:["wishlist-updated","show-detail"],setup(e,{emit:a}){const t=a,w=(0,s.KR)(!1),{movies:y,loading:C,hasMore:E,fetchPopularMovies:L,loadMoreMovies:_}=(0,r.$)(),P=()=>{w.value=window.scrollY>500;const e=window.scrollY+window.innerHeight,a=document.documentElement.scrollHeight;e>=a-200&&E.value&&!C.value&&_()},M=()=>{window.scrollTo({top:0,behavior:"smooth"})},R=e=>{t("show-detail",e.id)},X=(0,s.KR)(null),K=(0,s.KR)(!1),A=e=>{X.value=e,K.value=!0,document.body.style.overflow="hidden"},W=()=>{K.value=!1,document.body.style.overflow="",setTimeout((()=>{X.value=null}),300)},$=e=>{"Escape"===e.key&&K.value&&W()};return(0,l.sV)((()=>{L(),window.addEventListener("scroll",P),window.addEventListener("keydown",$)})),(0,l.hi)((()=>{window.removeEventListener("scroll",P),window.removeEventListener("keydown",$),document.body.style.overflow=""})),(e,a)=>((0,l.uX)(),(0,l.CE)("div",c,[(0,l.Lk)("div",v,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)((0,s.R1)(y),(t=>((0,l.uX)(),(0,l.Wv)(i.A,{key:t.id,movie:t,onWishlistUpdated:a[0]||(a[0]=a=>e.$emit("wishlist-updated",a)),onShowDetail:R,onClick:e=>A(t),class:"movie-card-animation"},{default:(0,l.k6)((()=>[(0,l.Lk)("div",d,[(0,l.bF)(u.A,{movie:t,class:"action-button wishlist-button",onWishlistUpdated:e.handleWishlistUpdate},null,8,["movie","onWishlistUpdated"]),(0,l.Lk)("button",{onClick:(0,n.D$)((e=>R(t)),["stop"]),class:"action-button info-button"},a[2]||(a[2]=[(0,l.Lk)("i",{class:"fas fa-info-circle"},null,-1),(0,l.Lk)("span",null,"상세정보",-1)]),8,g)])])),_:2},1032,["movie","onClick"])))),128))]),X.value?((0,l.uX)(),(0,l.CE)("div",{key:0,class:(0,o.C4)(["poster-overlay",{show:K.value}]),onClick:W},[(0,l.Lk)("div",{class:"poster-content",onClick:a[1]||(a[1]=(0,n.D$)((()=>{}),["stop"]))},[(0,l.Lk)("img",{src:`https://image.tmdb.org/t/p/original${X.value.poster_path}`,alt:X.value.title},null,8,p),(0,l.Lk)("div",h,[(0,l.Lk)("h2",null,(0,o.v_)(X.value.title),1),(0,l.Lk)("p",f,"개봉일: "+(0,o.v_)(X.value.release_date),1),(0,l.Lk)("p",m,(0,o.v_)(X.value.overview),1)]),(0,l.Lk)("button",{class:"close-button",onClick:W},a[3]||(a[3]=[(0,l.Lk)("i",{class:"fas fa-times"},null,-1)]))])],2)):(0,l.Q3)("",!0),(0,s.R1)(C)?((0,l.uX)(),(0,l.CE)("div",k,a[4]||(a[4]=[(0,l.Lk)("div",{class:"loading-spinner"},null,-1),(0,l.Lk)("p",{class:"loading-text"},"새로운 영화를 탐색하는 중...",-1)]))):(0,l.Q3)("",!0),!(0,s.R1)(C)&&!(0,s.R1)(E)&&(0,s.R1)(y).length>0?((0,l.uX)(),(0,l.CE)("div",b,a[5]||(a[5]=[(0,l.Lk)("i",{class:"fas fa-check-circle"},null,-1),(0,l.Lk)("span",null,"모든 영화를 불러왔습니다",-1)]))):(0,l.Q3)("",!0),(0,l.bo)((0,l.Lk)("button",{class:"scroll-top-button",onClick:M,"aria-label":"맨 위로 스크롤"},a[6]||(a[6]=[(0,l.Lk)("i",{class:"fas fa-arrow-up"},null,-1)]),512),[[n.aG,w.value]])]))}},y=t(1241);const C=(0,y.A)(w,[["__scopeId","data-v-4dd96aaa"]]);var E=C},1005:function(e,a,t){t.d(a,{A:function(){return C}});var l=t(6768),s=t(4232),n=t(5130),o=t(144),i=t(3289),r=t(9409);const u={ref:"gridContainer",class:"table-view"},c={class:"movie-grid"},v={key:0,class:"pagination-container"},d=["disabled"],g=["disabled"],p=["src","alt"],h={class:"poster-info"},f={class:"release-date"},m={key:0,class:"rating"},k={class:"overview"};var b={__name:"TableView",props:{movies:{type:Array,required:!0,default:()=>[]},currentPage:{type:Number,required:!0},totalPages:{type:Number,required:!0}},emits:["page-changed","wishlist-updated","show-detail"],setup(e){(0,o.KR)(20),(0,o.KR)(window.innerWidth<=768);const a=(0,o.KR)(null),t=(0,o.KR)(!1),b=e=>{a.value=e,t.value=!0,document.body.style.overflow="hidden"},w=()=>{t.value=!1,document.body.style.overflow="",setTimeout((()=>{a.value=null}),300)};return(o,y)=>((0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.Lk)("div",u,[(0,l.Lk)("div",c,[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(e.movies,(e=>((0,l.uX)(),(0,l.Wv)(i.A,{key:e.id,movie:e,onWishlistUpdated:y[0]||(y[0]=e=>o.$emit("wishlist-updated",e)),onShowDetail:b,class:"movie-card-animation"},null,8,["movie"])))),128))]),e.movies.length>0?((0,l.uX)(),(0,l.CE)("div",v,[(0,l.Lk)("button",{onClick:y[1]||(y[1]=e=>o.$emit("page-changed",1)),disabled:1===e.currentPage,class:"nav-btn"},y[5]||(y[5]=[(0,l.Lk)("i",{class:"fas fa-angle-double-left"},null,-1)]),8,d),(0,l.bF)(r.A,{"current-page":e.currentPage,"total-pages":e.totalPages,onPageChange:y[2]||(y[2]=e=>o.$emit("page-changed",e))},null,8,["current-page","total-pages"]),(0,l.Lk)("button",{onClick:y[3]||(y[3]=a=>o.$emit("page-changed",e.totalPages)),disabled:e.currentPage===e.totalPages,class:"nav-btn"},y[6]||(y[6]=[(0,l.Lk)("i",{class:"fas fa-angle-double-right"},null,-1)]),8,g)])):(0,l.Q3)("",!0)],512),a.value?((0,l.uX)(),(0,l.CE)("div",{key:0,class:(0,s.C4)(["poster-overlay",{show:t.value}]),onClick:w},[(0,l.Lk)("div",{class:"poster-content",onClick:y[4]||(y[4]=(0,n.D$)((()=>{}),["stop"]))},[(0,l.Lk)("img",{src:`https://image.tmdb.org/t/p/original${a.value.poster_path}`,alt:a.value.title},null,8,p),(0,l.Lk)("div",h,[(0,l.Lk)("h2",null,(0,s.v_)(a.value.title),1),(0,l.Lk)("p",f,"개봉일: "+(0,s.v_)(a.value.release_date),1),a.value.vote_average?((0,l.uX)(),(0,l.CE)("p",m," 평점: "+(0,s.v_)(Number(a.value.vote_average).toFixed(1)),1)):(0,l.Q3)("",!0),(0,l.Lk)("p",k,(0,s.v_)(a.value.overview),1)]),(0,l.Lk)("button",{class:"close-button",onClick:w},y[7]||(y[7]=[(0,l.Lk)("i",{class:"fas fa-times"},null,-1)]))])],2)):(0,l.Q3)("",!0)],64))}},w=t(1241);const y=(0,w.A)(b,[["__scopeId","data-v-5c8de6fc"]]);var C=y},8552:function(e,a,t){t.d(a,{A:function(){return c}});var l=t(6768),s=t(4232),n=t(144);const o={class:"view-toggle-container flex space-x-2"};var i={__name:"ViewToggle",props:{initialView:{type:String,default:"table"}},emits:["viewType-changed"],setup(e,{emit:a}){const t=e,i=a,r=(0,n.KR)(t.initialView),u=e=>{r.value=e,i("viewType-changed",e)};return(e,a)=>((0,l.uX)(),(0,l.CE)("div",o,[(0,l.Lk)("button",{onClick:a[0]||(a[0]=e=>u("table")),class:(0,s.C4)(["toggle-btn",{active:"table"===r.value}])},[(0,l.Lk)("div",{class:(0,s.C4)(["btn-background",{show:"table"===r.value}])},null,2),a[2]||(a[2]=(0,l.Lk)("i",{class:"fas fa-table"},null,-1))],2),(0,l.Lk)("button",{onClick:a[1]||(a[1]=e=>u("infinite")),class:(0,s.C4)(["toggle-btn",{active:"infinite"===r.value}])},[(0,l.Lk)("div",{class:(0,s.C4)(["btn-background",{show:"infinite"===r.value}])},null,2),a[3]||(a[3]=(0,l.Lk)("i",{class:"fas fa-list"},null,-1))],2)]))}},r=t(1241);const u=(0,r.A)(i,[["__scopeId","data-v-c72bf22a"]]);var c=u},8646:function(e,a,t){var l=t(9565),s=t(8551),n=t(1767),o=t(851);e.exports=function(e,a){a&&"string"===typeof e||s(e);var t=o(e);return n(s(void 0!==t?l(t,e):e))}},531:function(e,a,t){var l=t(6518),s=t(9565),n=t(9306),o=t(8551),i=t(1767),r=t(8646),u=t(9462),c=t(9539),v=t(6395),d=u((function(){var e,a,t=this.iterator,l=this.mapper;while(1){if(a=this.inner)try{if(e=o(s(a.next,a.iterator)),!e.done)return e.value;this.inner=null}catch(n){c(t,"throw",n)}if(e=o(s(this.next,t)),this.done=!!e.done)return;try{this.inner=r(l(e.value,this.counter++),!1)}catch(n){c(t,"throw",n)}}}));l({target:"Iterator",proto:!0,real:!0,forced:v},{flatMap:function(e){return o(this),n(e),new d(i(this),{mapper:e,inner:null})}})},670:function(e,a,t){t(531)}}]);
//# sourceMappingURL=624.4b4e5bca.js.map