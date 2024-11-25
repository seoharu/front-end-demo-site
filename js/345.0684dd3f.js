"use strict";(self["webpackChunkwsd02"]=self["webpackChunkwsd02"]||[]).push([[345],{8362:function(e,s,t){t.d(s,{A:function(){return o}});t(4114),t(8992),t(2577),t(7550);var a=t(144),r=t(6768);const l=()=>{const e=e=>{if(!e)return{isValid:!1,error:"이메일을 입력해주세요."};const s=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;return s.test(e)?{isValid:!0}:{isValid:!1,error:"유효한 이메일 형식이 아닙니다."}},s=e=>e?e.length<20?{isValid:!1,error:"유효한 TMDB API 키를 입력해주세요."}:{isValid:!0}:{isValid:!1,error:"비밀번호를 입력해주세요."},t=(e,s)=>s?e!==s?{isValid:!1,error:"비밀번호가 일치하지 않습니다."}:{isValid:!0}:{isValid:!1,error:"비밀번호 확인을 입력해주세요."},a=e=>e?{isValid:!0}:{isValid:!1,error:"이용약관에 동의해주세요."},r=t=>{const a=e(t.email);if(!a.isValid)return a;const r=s(t.password);return r.isValid?{isValid:!0}:r},l=r=>{const l=e(r.email);if(!l.isValid)return l;const o=s(r.password);if(!o.isValid)return o;const i=t(r.password,r.confirmPassword);if(!i.isValid)return i;const n=a(r.agreement);return n.isValid?{isValid:!0}:n};return{validateEmail:e,validatePassword:s,validatePasswordConfirm:t,validateAgreement:a,validateLoginForm:r,validateRegisterForm:l}},o=()=>{const{validateLoginForm:e,validateRegisterForm:s}=l(),t=(0,a.KR)(null),o=(0,a.KR)(!1),i=(0,a.KR)(!1),n=(0,r.EW)((()=>null!==t.value&&null!==localStorage.getItem("TMDb-Key"))),c=async e=>{try{const s=await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${e}&language=ko-KR&page=1`);return s.ok}catch{return!1}},u=async s=>{try{const a=e(s);if(!a.isValid)return{success:!1,error:a.error};const r=JSON.parse(localStorage.getItem("users")||"[]"),l=r.find((e=>e.id===s.email&&e.password===s.password));if(!l)return{success:!1,error:"이메일 또는 비밀번호가 일치하지 않습니다."};const o=await c(s.password);return o?(localStorage.setItem("TMDb-Key",s.password),localStorage.setItem("currentUser",s.email),s.rememberMe&&localStorage.setItem("keepLoggedIn","true"),t.value=s.email,{success:!0}):{success:!1,error:"유효하지 않은 TMDB API 키입니다."}}catch(a){return console.error("Login error:",a),{success:!1,error:"로그인 중 오류가 발생했습니다."}}},d=async e=>{try{const t=s(e);if(!t.isValid)return{success:!1,error:t.error};const a=await c(e.password);if(!a)return{success:!1,error:"유효하지 않은 TMDB API 키입니다."};const r=JSON.parse(localStorage.getItem("users")||"[]");return r.some((s=>s.id===e.email))?{success:!1,error:"이미 등록된 이메일입니다."}:(r.push({id:e.email,password:e.password}),localStorage.setItem("users",JSON.stringify(r)),{success:!0})}catch(t){return console.error("Register error:",t),{success:!1,error:"회원가입 중 오류가 발생했습니다."}}},v=()=>{localStorage.removeItem("TMDb-Key"),localStorage.removeItem("currentUser"),localStorage.removeItem("keepLoggedIn"),t.value=null,i.value=!1},m=()=>{const e=localStorage.getItem("currentUser"),s=localStorage.getItem("keepLoggedIn");return!(!e||"true"!==s)&&(t.value=e,!0)},p=()=>{o.value=window.scrollY>50},g=()=>{i.value=!i.value},f=()=>{i.value=!1},h=[{name:"홈",path:"/"},{name:"대세 콘텐츠",path:"/popular"},{name:"찾아보기",path:"/search"},{name:"내가 찜한 콘텐츠",path:"/wishlist"}],w=()=>!!n.value;return{currentUser:t,isLoggedIn:n,login:u,register:d,logout:v,checkAuth:m,requireAuth:w,isScrolled:o,isMobileMenuOpen:i,handleScroll:p,toggleMobileMenu:g,closeMobileMenu:f,menuItems:h}}},5932:function(e,s,t){t.d(s,{n:function(){return l}});t(4114),t(8992),t(7550);var a=t(144),r=t(6768);function l(){const e=(0,a.KR)([]),s=()=>{const s=localStorage.getItem("movieWishlist");s&&(e.value=JSON.parse(s))},t=()=>{localStorage.setItem("movieWishlist",JSON.stringify(e.value))},l=s=>e.value.some((e=>e.id===s)),o=s=>{const a=e.value.findIndex((e=>e.id===s.id));-1===a?e.value.push(s):e.value.splice(a,1),t()},i=(0,r.EW)((()=>e.value.length));return s(),{wishlist:e,isInWishlist:l,toggleWishlist:o,wishlistCount:i}}},1586:function(e,s,t){t.d(s,{A:function(){return u}});var a=t(6768),r=t(4232);const l={class:"loading-spinner"},o={key:0,class:"loading-message"};var i={__name:"LoadingSpinner",props:{loading:{type:Boolean,default:!1},message:{type:String,default:"로딩 중..."},type:{type:String,default:"full",validator:e=>["full","content","inline"].includes(e)}},setup(e){return(s,t)=>e.loading?((0,a.uX)(),(0,a.CE)("div",{key:0,class:(0,r.C4)(["loading-overlay",{"full-screen":"full"===e.type},{"content-only":"content"===e.type},{inline:"inline"===e.type}])},[(0,a.Lk)("div",l,[t[0]||(t[0]=(0,a.Lk)("div",{class:"spinner-container"},[(0,a.Lk)("div",{class:"spinner-outer"}),(0,a.Lk)("div",{class:"spinner-inner"}),(0,a.Lk)("i",{class:"fas fa-film film-icon"})],-1)),e.message?((0,a.uX)(),(0,a.CE)("p",o,(0,r.v_)(e.message),1)):(0,a.Q3)("",!0)])],2)):(0,a.Q3)("",!0)}},n=t(1241);const c=(0,n.A)(i,[["__scopeId","data-v-233b8adc"]]);var u=c},3289:function(e,s,t){t.d(s,{A:function(){return k}});var a=t(6768),r=t(4232),l=t(5130),o=t(144),i=t(4907);const n=["src","alt"],c={class:"absolute bottom-0 left-0 w-full p-4"},u={class:"text-lg font-bold mb-2"},d={class:"flex items-center justify-between mb-2"},v={class:"text-sm"},m={class:"flex items-center"},p={class:"Button-container"},g="/placeholder.jpg";var f={__name:"MovieCard",props:{movie:{type:Object,required:!0}},emits:["wishlist-updated","show-detail"],setup(e,{emit:s}){const t=e,f=(0,o.KR)(!1),h=(0,a.EW)((()=>t.movie.poster_path?`https://image.tmdb.org/t/p/w500${t.movie.poster_path}`:g)),w=(0,a.EW)((()=>t.movie.release_date?new Date(t.movie.release_date).toLocaleDateString("ko-KR"):"미정")),k=e=>{e.target.src=g};return(s,t)=>((0,a.uX)(),(0,a.CE)("div",{class:"movie-card relative group cursor-pointer overflow-hidden rounded-lg",onMouseenter:t[1]||(t[1]=e=>f.value=!0),onMouseleave:t[2]||(t[2]=e=>f.value=!1)},[(0,a.Lk)("img",{src:h.value,alt:e.movie.title,class:(0,r.C4)(["w-full h-full object-cover transition-transform duration-300",{"scale-110":f.value}]),onError:k},null,42,n),(0,a.Lk)("div",{class:(0,r.C4)(["absolute inset-0 bg-black/70 transition-opacity duration-300",{"opacity-0":!f.value,"opacity-100":f.value}])},[(0,a.Lk)("div",c,[(0,a.Lk)("h3",u,(0,r.v_)(e.movie.title),1),(0,a.Lk)("div",d,[(0,a.Lk)("span",v,(0,r.v_)(w.value),1),(0,a.Lk)("div",m,[t[3]||(t[3]=(0,a.Lk)("i",{class:"fas fa-star text-yellow-400 mr-1"},null,-1)),(0,a.eW)(" "+(0,r.v_)(e.movie.vote_average.toFixed(1)),1)])]),(0,a.Lk)("div",p,[(0,a.bF)(i.A,{movie:e.movie,class:"action-btn wishlist-btn"},null,8,["movie"]),(0,a.Lk)("button",{onClick:t[0]||(t[0]=(0,l.D$)((t=>s.$emit("show-detail",e.movie)),["stop"])),class:"action-btn info-btn"},t[4]||(t[4]=[(0,a.Lk)("i",{class:"fas fa-info-circle"},null,-1),(0,a.Lk)("span",null,"상세정보",-1)]))])])],2)],32))}},h=t(1241);const w=(0,h.A)(f,[["__scopeId","data-v-bb461a90"]]);var k=w},4907:function(e,s,t){t.d(s,{A:function(){return d}});var a=t(6768),r=t(5130),l=t(4232),o=t(144),i=t(5932),n={__name:"WishlistClick",props:{movie:{type:Object,required:!0}},emits:["wishlist-updated"],setup(e,{emit:s}){const t=e,n=s,{isInWishlist:c,toggleWishlist:u}=(0,i.n)(),d=(0,o.KR)(!1),v=(0,o.KR)(""),m=(0,a.EW)((()=>p.value?"찜 완료":"찜하기")),p=(0,a.EW)((()=>!(!t.movie||!t.movie.id)&&c(t.movie.id))),g=e=>{v.value=e,d.value=!0,setTimeout((()=>{d.value=!1}),2e3)},f=()=>{u(t.movie),n("wishlist-updated"),g(p.value?"찜 목록에 추가되었습니다.":"찜 목록에서 제거되었습니다.")};return(e,s)=>((0,a.uX)(),(0,a.CE)("button",{onClick:(0,r.D$)(f,["stop"]),class:(0,l.C4)(["wishlist-btn action-btn",{"is-wishlisted":p.value}])},[(0,a.Lk)("i",{class:(0,l.C4)(["fas fa-heart",{"text-white":!p.value,"text-pink-400 animate-pulse":p.value}])},null,2),(0,a.Lk)("span",null,(0,l.v_)(m.value),1),d.value?((0,a.uX)(),(0,a.CE)("div",{key:0,class:(0,l.C4)(["toast-message",{show:d.value}])},(0,l.v_)(v.value),3)):(0,a.Q3)("",!0)],2))}},c=t(1241);const u=(0,c.A)(n,[["__scopeId","data-v-30fcb4e4"]]);var d=u},2088:function(e,s,t){t.d(s,{A:function(){return b}});t(4114);var a=t(6768),r=t(4232),l=t(144),o=t(5130),i=t(1387),n=t(8362),c=t(8950),u=t(292),d=t(2353);const v={class:"container mx-auto h-full flex items-center justify-between"},m={class:"movie-pages"},p={class:"right-side"},g={key:0,class:"dropdown-menu"},f={class:"dropdown-header"};var h=(0,a.pM)({__name:"PageHeader",setup(e){c.Yv.add(d.OxR,d.X46,d.GxD,d.rhE),(0,a.pM)({name:"PageHeader"});const s=(0,i.rd)(),{currentUser:t,isLoggedIn:h,logout:w,isScrolled:k,handleScroll:b,menuItems:L,checkAuth:y}=(0,n.A)(),_=(0,l.KR)(!1),I=e=>{const s=e.target;s.closest(".right-side")||(_.value=!1)},C=()=>{h.value?_.value=!_.value:s.push("/signin")},S=()=>{w(),_.value=!1,s.push("/signin")};return(0,a.wB)((()=>s.currentRoute.value.path),(()=>{_.value=!1})),(0,a.sV)((()=>{window.addEventListener("scroll",b),window.addEventListener("click",I),y()})),(0,a.hi)((()=>{window.removeEventListener("scroll",b),window.removeEventListener("click",I)})),(e,s)=>{const i=(0,a.g2)("router-link");return(0,a.uX)(),(0,a.CE)("header",{class:(0,r.C4)(["header-container",{"header-scrolled":(0,l.R1)(k),"header-initial":!(0,l.R1)(k)}])},[(0,a.Lk)("nav",v,[(0,a.bF)(i,{to:"/",class:"flex items-center"},{default:(0,a.k6)((()=>[(0,a.bF)((0,l.R1)(u.gc),{icon:"fas fa-film",class:"logo"})])),_:1}),(0,a.Lk)("div",m,[((0,a.uX)(!0),(0,a.CE)(a.FK,null,(0,a.pI)((0,l.R1)(L),(s=>((0,a.uX)(),(0,a.Wv)(i,{key:s.path,to:s.path,class:(0,r.C4)(["movie-page",{active:e.$route.path===s.path}])},{default:(0,a.k6)((()=>[(0,a.eW)((0,r.v_)(s.name),1)])),_:2},1032,["to","class"])))),128))]),(0,a.Lk)("div",p,[(0,l.R1)(h)?((0,a.uX)(),(0,a.CE)("button",{key:0,onClick:C,class:"user-button"},[(0,a.bF)((0,l.R1)(u.gc),{icon:"fas fa-user",class:"text-lg"})])):((0,a.uX)(),(0,a.Wv)(i,{key:1,to:"/signin",class:"login-link"},{default:(0,a.k6)((()=>[(0,a.bF)((0,l.R1)(u.gc),{icon:"fas fa-sign-in-alt",class:"mr-2"}),s[0]||(s[0]=(0,a.eW)(" 로그인 "))])),_:1})),(0,a.bF)(o.eB,{"enter-active-class":"dropdown-enter","enter-from-class":"dropdown-enter-from","enter-to-class":"dropdown-enter-to","leave-active-class":"dropdown-leave","leave-from-class":"dropdown-leave-from","leave-to-class":"dropdown-leave-to"},{default:(0,a.k6)((()=>[_.value?((0,a.uX)(),(0,a.CE)("div",g,[(0,a.Lk)("div",f,(0,r.v_)((0,l.R1)(t)),1),(0,a.Lk)("button",{onClick:S,class:"dropdown-item"},[(0,a.bF)((0,l.R1)(u.gc),{icon:"fas fa-sign-out-alt",class:"mr-2"}),s[1]||(s[1]=(0,a.eW)(" 로그아웃 "))])])):(0,a.Q3)("",!0)])),_:1})])])],2)}}}),w=t(1241);const k=(0,w.A)(h,[["__scopeId","data-v-11a980f0"]]);var b=k}}]);
//# sourceMappingURL=345.0684dd3f.js.map