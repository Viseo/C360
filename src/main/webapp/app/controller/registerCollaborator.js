Vue.use(VueResource);

let NavigationMenu = Vue.component('connect-user',{
    data:function(){
        return{
            color_inscription: 'color-blue',
            color_connexion: 'color-blue',
            tabconnexion: "tab active",
            tabinscription: "tab",
            newCollab: false
        }
    },
    template:`
        <div class="col-lg-8 col-sm-12 col-xs-12 col-md-6 col-lg-6 col-lg-offset-3  col-md-offset-3">
            <div class="panel panel-default">
                <ul class="tab-group">
                    <li :class="tabinscription">
                        <a @click="showInscriptionForm()">Inscription</a>
                    </li>
                    <li :class="tabconnexion">
                        <a @click="showConnexionForm()">Connexion</a>
                    </li>
                </ul>
                <div class="panel-body">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-6 cold-lg-6 col-offset-3 col-md-offset-3">
                            <inscription-form @test="showConnexionForm()" v-if="newCollab"></inscription-form>
                            <connexion-form v-else></connexion-form>
                        </div>
                    </div>
                </div>
            </div>
        </div> `,
    methods: {
        showInscriptionForm() {
            this.tabinscription = 'tab active';
            this.tabconnexion = 'tab';
            this.newCollab=true;
        },
        showConnexionForm() {
            this.tabinscription = 'tab';
            this.tabconnexion = 'tab active';
            this.newCollab=false;
        }
    }
})

let Formulaire = Vue.component('inscription-form', {
    template: `
             <form id="registr-form" @submit.prevent="verifyForm">
                <customInput 
                    label="login" 
                    labelText="Code de login" 
                    icon="glyphicon-th" 
                    type="text" 
                    tab="1" 
                    placeholder="ABC1234" 
                    v-model="personnalIdNumber" 
                    @focus="loginEmpty=false;" 
                    @blur="isLoginEmpty" 
                    maxlength="20" minlength="2" 
                    :emptyField="loginEmpty"
                    emptyMessage="Code de login obligatoire" 
                    :existField="!personalIdNumberAlreadyExist"
                    existMessage="Ce code de login a déjà été enregistré" 
                    :errorField="!isLoginValid && !loginEmpty"
                    :errorMessage="errorMessageLogin">
                </customInput>
                <!-- NOM -->
                 <customInput 
                    label="nom" 
                    labelText="Nom" 
                    icon="glyphicon-user" 
                    type="text"
                    tab="2" 
                    placeholder="DUPONT" 
                    v-model="lastName" 
                    @focus="lastNameEmpty = false" 
                    @blur="isLastNameEmpty" 
                    maxlength="125" minlength="2" 
                    :emptyField="lastNameEmpty"
                    emptyMessage="Nom est obligatoire" 
                    existField=""
                    :errorField="!isLastNameValid && !lastNameEmpty"
                    :errorMessage="errorMessageLastName">
                </customInput>
                <!-- PRENOM -->
                <customInput 
                    label="prenom" 
                    labelText="Prénom" 
                    icon="glyphicon-user" 
                    type="text"
                    tab="2" 
                    placeholder="Eric" 
                    v-model="firstName" 
                    @focus="firstNameEmpty = false" 
                    @blur="isFirstNameEmpty" 
                    maxlength="125" minlength="2" 
                    :emptyField="firstNameEmpty"
                    emptyMessage="Prénom est obligatoire" 
                    existField=""
                    :errorField="!isFirstNameValid && !firstNameEmpty"
                    :errorMessage="errorMessageFirstName">
                </customInput>          
                <!-- EMAIL-->
                <customInput 
                    label="email" 
                    labelText="Email" 
                    icon="glyphicon-envelope" 
                    type="text"
                    tab="2" 
                    placeholder="eric.dupont@viseo.com" 
                    v-model="email" 
                    @focus="emailAlreadyExist = true; emailEmpty = false" 
                    @blur="isEmailEmpty"
                    :emptyField="emailEmpty"
                    emptyMessage="Email est obligatoire" 
                    :existField="!emailAlreadyExist"
                    existMessage="Cet email a déjà été enregistré."
                    :errorField="!isEmailValid && !emailEmpty"
                    :errorMessage="errorMessageEmail">
                </customInput>  
                <!-- MOT DE PASSE -->
                <customPasswordInput
                    label="mdp"
                    labelText="Mot de passe"
                    v-model="password"
                    @focus="passwordEmpty = false" 
                    @blur="isPasswordEmpty"
                    :emptyField="passwordEmpty"
                    :errorField="!isPasswordValid && !passwordEmpty"
                    :errorMessage="errorMessagePassword"
                    :show="showPass"
                    @click="showPass = !showPass">
                 </customPasswordInput>
             
                <!-- CONFIRMATION MOT DE PASSE -->
                <customPasswordInput
                    label="mdpc"
                    labelText="Confirmation mot de passe"
                    v-model="confirmPassword"
                    @focus="confirmPasswordEmpty = false" 
                    @blur="isConfirmPasswordEmpty"
                    :emptyField="confirmPasswordEmpty"
                    :errorField="!isConfirmPasswordValid && !confirmPasswordEmpty"
                    :errorMessage="errorMessageConfirmPassword"
                    :show="showPassConf"
                    @click="showPassConf = !showPassConf">
                 </customPasswordInput>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-12 cold-lg-12 ">
                            <button type="submit" name="register-submit" id="register-submit"
                                    tabindex="4" class="form-control btn btn-primary">S'inscrire
                            </button>
                        </div>
                    </div>
                </div>
            </form>          
            `,
    data: function () {
        return {
            collaborator:{
                personnalIdNumber:'',
                lastName:'',
                firstName:'',
                email:'',
                password:'',
                confirmPassword:'',
            },
            personnalIdNumber:'',
            lastName:'',
            firstName:'',
            email:'',
            password:'',
            confirmPassword:'',
            errorMessageLogin:'',
            errorMessageLastName:'',
            errorMessageFirstName:'',
            errorMessageEmail:'',
            errorMessagePassword:'',
            errorMessageConfirmPassword:'',
            collaboratorToRegister:{},
            verif: true,
            personalIdNumberAlreadyExist:true,
            emailAlreadyExist:true,
            loginEmpty:false,
            lastNameEmpty:false,
            firstNameEmpty:false,
            emailEmpty:false,
            passwordEmpty:false,
            confirmPasswordEmpty:false,
            showPass:false,
            showPassConf:false,
            border: 'color-red',
            isLoginValid:true,
            isLastNameValid:true,
            isFirstNameValid:true,
            isEmailValid :true,
            isPasswordValid:true,
            isConfirmPasswordValid:true
        }
    },

    watch: {
        personnalIdNumber: function (value) {
            this.verifyLogin(value);
        },
        lastName: function(value) {
            this.verifyLastName(value);
        },
        firstName: function(value) {
            this.verifyFirstName(value);
        },
        email: function(value) {
            this.verifyEmail(value);
        },
        password: function(value) {
            this.verifyPassword(value);
            if(this.confirmPassword!='')
                this.verifyConfirmPassword(value);
        },
        confirmPassword: function(value) {
            this.verifyConfirmPassword(value);
        }
    },

    methods: {
        verifyLogin(personnalIdNumber) {
            this.personalIdNumberAlreadyExist = true;
            this.loginEmpty = false;
            if (/^[A-Z]{3}[0-9]{4}$/.test(personnalIdNumber)) {
                this.errorMessageLogin = '';
                this.isLoginValid = true;
            } else {
                this.errorMessageLogin = 'Veuillez entrer  code de login valide';
                this.isLoginValid = false;
            }
        },

        isLoginEmpty(){
            if (this.personnalIdNumber == '') {
                this.loginEmpty = true;
            }
        },

        verifyLastName(lastName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/.test(lastName)) {
                this.errorMessageLastName = '';
                this.isLastNameValid=true;
            } else {
                this.errorMessageLastName = 'Veuillez entrer un nom valide';
                this.isLastNameValid=false;
            }
        },

        isLastNameEmpty(){
            if(this.lastName == ''){
                this.lastNameEmpty = true;
            }
        },

        verifyFirstName(firstName) {
            if (/^(([a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]+[\s]{0,1})+[a-zA-ZÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ.'-]*){2,125}$/ .test(firstName)) {
                this.errorMessageFirstName = '';
                this.isFirstNameValid=true;
            } else {
                this.errorMessageFirstName = 'Veuillez entrer un Prénom valide';
                this.isFirstNameValid=false;
            }
        },

        isFirstNameEmpty(){
            if(this.firstName == ''){
                this.firstNameEmpty = true;
            }
        },

        verifyEmail(email){
            if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((([0-9]{1,3}\.)+[0-9]{1,3})|(([a-zA-ZàÀÁÂÃÄÅàáâãäåÒÓÔÕÖØòóôõöøÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÿÑñ\-0-9]+\.)+[a-zA-Z0-9]{2,}))$/
                    .test(email)) {

                this.errorMessageEmail = '';
                this.isEmailValid=true;
            } else {
                this.errorMessageEmail = 'Veuillez entrer un email valide';
                this.isEmailValid=false;
            }
        },

        isEmailEmpty(){
            if(this.email == ''){
                this.emailEmpty = true;
            }
        },

        verifyPassword(password) {
            if (/^(.){6,125}$/.test(password)) {
                this.errorMessagePassword = '';
                this.isPasswordValid=true;
            } else {
                this.errorMessagePassword = 'Le mot de passe doit avoir au minimum 6 caractères';
                this.isPasswordValid=false;
            }
        },

        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        verifyConfirmPassword(confirmPassword) {
            if (this.confirmPassword === this.password) {
                this.errorMessageConfirmPassword = '';
                this.isConfirmPasswordValid = true;
            } else {
                this.errorMessageConfirmPassword = 'La confirmation du mot de passe n\'est pas valide';
                this.isConfirmPasswordValid = false;
            }
        },

        isConfirmPasswordEmpty(){
            if(this.confirmPassword == ''){
                this.confirmPasswordEmpty = true;
            }
        },

        saveAction() {
            delete this.collaboratorToRegister['confirmPassword'];  //delete la confirmation de password
            //post the form to the server
            this.$http.post("api/collaborateurs", this.collaboratorToRegister)
                .then(
                    function (response) {
                        this.emailAlreadyExist = true;
                        this.personalIdNumberAlreadyExist = true;
                        this.$emit('test');
                    },
                    function (response) {
                        console.log("Error: ",response);
                        if (response.data.message == "personnalIdNumber") {
                            this.personalIdNumberAlreadyExist = false;
                            this.emailAlreadyExist = true;
                        }
                        else if(response.data.message == "email"){
                            this.emailAlreadyExist = false;
                            this.personalIdNumberAlreadyExist = true;
                        }else{
                            console.error(response);
                        }
                    }
                );
        },

        verifyForm (){
            this.lastName = this.lastName.replace(/ +/g, " ").replace(/ +$/, "");
            this.firstName = this.firstName.replace(/ +/g, " ").replace(/ +$/, "");
            this.isLoginEmpty(); this.isLastNameEmpty(); this.isFirstNameEmpty(); this.isEmailEmpty(); this.isPasswordEmpty(); this.isConfirmPasswordEmpty();
            if(!this.loginEmpty && !this.lastNameEmpty && !this.firstNameEmpty && !this.emailEmpty && !this.passwordEmpty && !this.confirmPasswordEmpty && this.isConfirmPasswordValid){
                this.personalIdNumberAlreadyExist = true;
                this.emailAlreadyExist = true;
                this.collaborator.personnalIdNumber=this.personnalIdNumber;
                this.collaborator.lastName=this.lastName;
                this.collaborator.firstName=this.firstName;
                this.collaborator.email=this.email;
                this.collaborator.password=this.password;
                this.collaborator.confirmPassword=this.confirmPassword;
                this.collaboratorToRegister = JSON.parse(JSON.stringify(this.collaborator));
                this.saveAction();
            }
        },
    }
})

Vue.component('connexionForm', {
    template: `
             <form id="registr-form" @submit.prevent="VerifyForm">
             <table style="border-spacing: 0px">
                <!-- EMAIL-->
                <div class="form-group" :class="{'has-error':emailEmpty || !isNotNewEmail}">
                    <label for="email">Email</label>
                    <div class="inner-addon left-addon" :class="{ 'control': true }">
                    <tr><td style="width: 500px;">
                        <i class="glyphicon glyphicon-envelope"></i>
                        <input type="email"  name="email" id="email" tabindex="2"  class="form-control"  placeholder="eric.dupont@viseo.com"
                               v-model="email" @focus="emailEmpty = false; isNotNewEmail = true; showPopup = false;"  @blur="isEmailEmpty" onfocus="this.placeholder = ''"
                               onblur="this.placeholder = 'eric.dupont@viseo.com'">
                    </td></tr>
                    <tr><td style="height: 20px;">
                        <span v-show="emailEmpty" class="color-red ">Email est obligatoire.</span>
                        <span v-show="!isNotNewEmail && !emailEmpty" class="color-red ">Veuillez renseigner votre Email</span>
                    </td></tr>
                    </div>
                </div>
                <!-- MOT DE PASSE -->
                <div class="form-group" :class="{'has-error':passwordEmpty }">
                    <label for="mdp">Mot de passe</label>
                    <div class="password" :class="{ 'control': true }">
                    <tr><td style="width: 500px;">
                        <i class="glyphicon glyphicon-lock"></i>
                        <span @click="showPass = !showPass" v-show="!showPass && password" class="glyphicon glyphicon-eye-open"> </span>
                        <span @click="showPass = false" v-show="showPass && password" class="glyphicon glyphicon-eye-close"> </span>
                        <input type="password" v-model="password" v-show="!showPass" name="mdp" id="mdp" tabindex="2" class="form-control"
                               placeholder="••••••" onfocus="this.placeholder = ''" onblur="this.placeholder = '••••••'" @focus="passwordEmpty = false; showPopup = false;"
                               @blur="isPasswordEmpty">
                        <input type="text" v-model="password" v-show="showPass"  name="mdp" id="mdp2" tabindex="2" class="form-control"
                               @focus="passwordEmpty = false" @blur="isPasswordEmpty">
                    </td></tr>
                    <tr><td style="height: 20px;">
                        <span v-show="passwordEmpty"  class="color-red ">Mot de passe est obligatoire.</span>
                    </td></tr>
                    </div>
                </div>
                <div class="checkbox">
                     <label><input type="checkbox" value="" v-model="stayConnected">Rester Connecté</label>
                     <a href="#" @click="showPopupFn" class="forgotPassword">Mot de passe oublié</a>
                     <br><span v-show="isErrorAuthentification" class="color-red">Connexion refusée: veuillez entrer une adresse e-mail et un mot de passe valide</span>
                     <div class="popup col-md-12 col-sm-12 col-lg-12" v-show="showPopup">
                        <span class="popuptext animated slideInUp" id="myPopup">Le mot de passe a été envoyé à {{email}}</span>
                     </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-xs-12 col-xm-12 col-md-12 cold-lg-12 ">
                            <button type="submit" name="register-submit" id="register-submit"
                                    tabindex="4" class="form-control btn btn-primary">Se connecter
                            </button>
                        </div>
                    </div>
                </div>
            </table>
            </form>          
            `,
    data: function () {
        return {
            user:{
                email:'',
                password:'',
            },
            email:'',
            password:'',
            userToRegister:{},
            isErrorAuthentification:false,
            verif: true,
            emailEmpty:false,
            passwordEmpty:false,
            showPass:false,
            stayConnected:true,
            showPopup:false,
            border: 'color-red',
            allUsers:undefined,
            isNotNewEmail:true,
            emailToSend:'',
            passwordToSend:'',
            idToSend:''
        }
    },
    methods: {

        handleCookie() {
            if(this.stayConnected) {
                document.cookie = "mail="+this.user.email;
                document.cookie = "password="+this.user.password;
            }
            else {
                let getCookieMail = document.cookie.match('(^|;)\\s*' + "mail" + '\\s*=\\s*([^;]+)');
                let getCookiePassword = document.cookie.match('(^|;)\\s*' + "password" + '\\s*=\\s*([^;]+)');
                if(getCookieMail || getCookiePassword) {
                    document.cookie = "mail="+ this.user.email + "; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                    document.cookie = "password="+this.user.password +"; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/";
                }
            }
        },
        showPopupFn() {
            if (this.email == '') {
                this.emailEmpty = true;
            } else {
                this.gatherUsersFromDatabaseToVerify();
            }
        },
        isEmailEmpty(){
            if(this.email == ''){
                this.emailEmpty = true;
            }
        },
        isPasswordEmpty(){
            if(this.password == ''){
                this.passwordEmpty = true;
            }
        },
        VerifyForm(){
            this.isEmailEmpty(); this.isPasswordEmpty();
            if(!this.emailEmpty && !this.passwordEmpty){
                this.user.email=this.email;
                this.user.password=this.password;
                this.userToRegister = JSON.parse(JSON.stringify(this.user));
                this.VerifyUserByDatabase();
            }
        },
        VerifyUserByDatabase(){

            this.$http.post("api/user", this.userToRegister)
                .then(
                    function (response) {
                        this.handleCookie();
                        window.location.pathname = '/addTrainingTopic.html';
                    }
                ).catch(function () {
                    this.password = "";
                    this.user.password = "";
                    this.isErrorAuthentification = true;
                });
        },
        gatherUsersFromDatabaseToVerify(){
            this.$http.get("api/collaborateurs").then(
                function (response) {
                    this.allUsers = response.data;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            ).then(
                function () {
                    this.VerifyEmailFromDatabase();
                    this.isErrorAuthentification = false;
                    if(this.isNotNewEmail == true){
                        var self = this
                        this.$http.post("api/sendemail/" + this.idToSend);
                        this.showPopup = true;
                        setTimeout(function () {
                            self.showPopup = false;
                        }, 10000);
                    }
                }
            )
        },
        VerifyEmailFromDatabase(){
            this.isNotNewEmail = false;
            for (var tmp in this.allUsers) {
                if (this.email == this.allUsers[tmp].email){
                    this.emailToSend = this.allUsers[tmp].email;
                    this.passwordToSend = this.allUsers[tmp].password;
                    this.idToSend = this.allUsers[tmp].id;
                    this.isNotNewEmail = true;
                    break;
                }
            }
        }
    }
})

let customInput = Vue.component('customInput', {
    props: ['value', 'label', 'labelText', 'icon', 'type', 'tab', 'placeholder', "maxlength",
            "minlength", 'emptyField', "emptyMessage", "existField", "existMessage", "errorField", "errorMessage" ],
    template: `
                <table style="border-spacing: 0px">
                <div class="form-group">
                    <label for="label">{{labelText}}</label>
                    <div class="inner-addon left-addon"   
                        :class="{ 'has-error' : emptyField || existField || errorField }">
                    <tr><td style="width: 500px;">
                        <i class="glyphicon" :class="icon"></i>
                        <input v-if="type=='text'" 
                               type="text" 
                               :id="label" 
                               :tabindex="tab" 
                               class="form-control"
                               :placeholder="placeholder" 
                               @focus="handleFocus" @blur="handleBlur"
                               @input="updateValue($event.target.value)"
                               onblur="this.placeholder = placeholder " 
                               maxlength="maxlength" 
                               minlength="minlength">
                        <input v-if="type=='email'" 
                               type="email" 
                               :id="label" 
                               :tabindex="tab" 
                               class="form-control"
                               :placeholder="placeholder" 
                               @focus="handleFocus" @blur="handleBlur"
                               @input="updateValue($event.target.value)"
                               onblur="this.placeholder = placeholder " >
                    </td></tr>
                    <tr><td style="height: 20px;">
                        <span v-show="emptyField" class="color-red">{{labelText}} est obligatoire</span>
                        <span v-show="existField" class="color-red ">{{existMessage}}</span>
                        <span v-show="errorField" class="color-red">{{ errorMessage }}</span>
                    </td></tr>
                    </div>
                </div>
                </table>
                `,
    data: function() {
            return {
                show: false
            }
    },
    methods: {
        updateValue(value){
            this.textValue = value;
            this.$emit('input',value);
        },
        handleFocus(){
            this.$emit('focus');
        },
        handleBlur(){
            this.$emit('blur');
        },

    }
} );

let customPasswordInput = Vue.component('customPasswordInput', {
    props: ['value', 'label', 'labelText', 'emptyField', 'errorField', 'errorMessage', 'show'],
    template: `<table style="border-spacing: 0px">
                <div class="form-group"   :class="{'has-error': emptyField || errorField }">
                    <label for="label">{{labelText}}</label>
                    <div class="password" :class="{ 'control': true }">
                    <tr><td style="width: 500px;">
                        <i class="glyphicon glyphicon-lock "></i>
                        <span @click="handleClick" v-show="!show && !emptyField" class="glyphicon glyphicon-eye-open "> </span>
                        <span @click="handleClick" v-show="show && !emptyField" class="glyphicon glyphicon-eye-close "> </span> 
                        <input type="password"  
                                v-show="!show" 
                                :value="textValue" 
                                :id="label" 
                                tabindex="2" 
                                class="form-control"
                                placeholder="••••••"  
                                onfocus="this.placeholder = ''" 
                                onblur="this.placeholder = '••••••'" 
                                @focus="handleFocus" @blur="handleBlur"
                                @input="updateValue($event.target.value)">
                        <input type="text" 
                                v-show="show"
                                :value="textValue" 
                                :id="label" 
                                tabindex="2" 
                                class="form-control"
                                @focus="handleFocus" @blur="handleBlur"
                                @input="updateValue($event.target.value)">
                    </td></tr>
                    <tr><td style="height: 20px;">
                        <span v-show="emptyField" class="color-red ">{{labelText}} est obligatoire</span>
                        <span v-show="errorField && !emptyField" class="color-red">{{errorMessage}}</span>
                    </td></tr>
                    </div>
                </table>
    `, data: function(){
        return{
            textValue: this.value,
        }
    },

    methods: {
        updateValue(value){
            this.textValue = value;
            this.$emit('input',value);
        },
        handleFocus(){
            this.$emit('focus');
        },
        handleBlur(){
            this.$emit('blur');
        },
        handleClick(){
            this.$emit('click');
        }
    }
});