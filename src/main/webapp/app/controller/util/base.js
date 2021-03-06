/**
 * Created by HBO3676 on 05/05/2017.
 */
function BaseComponent(prototype) {

    var result = {
        getPageName: function () {
            return this.$route.name;
        },

        goTo: function (pageName) {
            this.$router.push("/" + pageName);
        },

        post: function(url,data,success,error){
            if (!error) {
                error = (response) => {
                    console.log("Error: ", response);
                    console.error(response);
                }
            }
            this.$http.post(url, data)
                .then(success, error);
        },

        get: function (url, success, error) {
            this.$http.get(url)
                .then(success, error);
        },

        put: function (url, data, success, error) {
            this.$http.put(url,data)
                .then(success, error);
        },

        activateScrollUp: function (idChevronUp, idComponentToScroll) {
            $(idChevronUp).click(function () {
                $(idComponentToScroll).animate({scrollTop: "-=100"}, 500);
            });
        },

        activeScrollDown: function (idChevronDown, idComponentToScroll) {
            $(idChevronDown).click(function () {
                $(idComponentToScroll).animate({scrollTop: "+=100"}, 500);
            })
        },

        activateScrollWheel: function(idComponentToScroll){
            $(idComponentToScroll).bind('mousewheel DOMMouseScroll', function(event){
                if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                    $(idComponentToScroll).animate({scrollTop: "-=100"}, 80);
                }
                else{
                    $(idComponentToScroll).animate({scrollTop: "+=100"}, 80);
                }
            });
        },

        getCookie: function(cookieName) {
            let name = cookieName + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    console.log(c.substring(name.length, c.length));
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        checkForChevrons(idContainer,message) {
            var element = document.getElementById(idContainer);
            console.log(element.clientHeight);
            console.log(element.scrollHeight);
            console.log(message);
            if (element.clientHeight < element.scrollHeight) {
                return true;
            } else {
                return false;
            }
        },

        getCollaboratorInfoFromCookie: function (){
            let collaboratorInfo = {id:'', lastName:'', firstName:'', admin:''};
            let token = this.getCookie("token");
            if (token != ""){
                collaboratorInfo.id = jwt_decode(token).id;
                collaboratorInfo.lastName = jwt_decode(token).lastName;
                collaboratorInfo.firstName = jwt_decode(token).sub;
                collaboratorInfo.admin = jwt_decode(token).roles;
                return collaboratorInfo;
            }
            return "";
        },

        getStayconnetedFromCookie: function(){
            let stayConnected = this.getCookie("stayconnected");
            return stayConnected;
        },

        verifyLastName(lastName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this.errorMessageLastName = '';
                this.isLastNameValid = true;
            } else {
                this.errorMessageLastName = 'Veuillez entrer un nom valide';
                this.isLastNameValid = false;
            }
        }
    };

    result.__proto__ = prototype;
    return result;

}