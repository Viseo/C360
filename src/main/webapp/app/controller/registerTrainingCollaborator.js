/**
 * Created by CLH3623 on 10/04/2017.
 */
Vue.component('collaborator-formation', {
    data: function () {
        return {
            sessionAlreadybooked:[],
            trainingsFound: [],
            sessionAlreadyBookedMessage:false,
            noTrainingFound: false,
            sessionsByCollab:[],
            allTrainings: [],
            addingRequestSucceeded: false,
            noSessionsSelectedError: false,
            checkedSessions: [],
            selected: '',
            check: false,
            idTraining: '3',
            listTrainingSessions: [],
            collaboratorIdentity: {
                id: '',
                roles:'',
                lastName: '',
                firstName: ''
            },
            RequestToRegister: {
                trainingDescription: {},
                collaboratorIdentity: {},
                trainingSessionsDescriptions: []
            },
            allTrainingTitles: [],
            value: '',
            selectedTraining: '',
            trainingSelected: {},
            emptyTraining: false,
            emptyTrainingErrorMessage: "Veuillez sélectionner une formation",
            listTrainingSession: [],
            isNoSession: true,
            displayTrainings: false
        }
    },
    template: `<div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12 col-lg-12 col-sm-12" style="padding:10px;" ></div>
                            <div class="col-sm-12 col-md-10 col-lg-7">
                                <div class="row">
                                    <div class="col-lg-7 col-md-7 text-center">
                                        <legend>Demande de formation</legend>
                                    </div>
                                </div>
                                <div class="row">
                                    <div id="trainingContainer">
                                                      <div class="row">
                                            <div class="col-lg-4 col-md-4 col-sm-12">
                                                <select required class="form-control" v-model="selectedTraining">
                                                    <option  value="" disabled hidden>Formations disponibles</option>
                                                    <option v-for="training in allTrainings" :value="training.id">{{training.trainingTitle}}</option>
                                                </select>
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-12">
                                                <input @click="displayTrainingsFn" type="submit" class="btn btn-primary" value="Valider"/>
                                            </div>
                                        <div class="col-lg-4 col-lg-offset-2 col-md-offset-2 col-md-4 col-sm-12 searchField">
                                                <input type="submit" class="glyphicon glyphicon-search" @click="storeTrainingsFound" value=""></span>
                                                <typeahead v-model="value" v-bind:data="allTrainingTitles" placeholder="Entrer une formation">
                                                    </typeahead>  
                                                     <div v-show="noTrainingFound" style="margin-top:10px;"> Aucun résultat trouvé </div>                                    
                                        </div>
                                    </div>
                                                   <div class="row">
                                            <p id="trainingErrorMessage" class="color-red col-lg-4 col-md-4 col-sm-12" v-show="emptyTraining">{{emptyTrainingErrorMessage}}</p>
                                        </div>
                                        
                                        <div class="col-lg-12 col-md-12 col-sm-12" v-show="displayTrainings">
                                            <p style="margin-top:50px;"></p>
                                            <hr style="margin:0px">
                                            <accordion :one-at-atime="true" type="info">
                                            
                                            <div v-for="training in trainingsFound">
                                            <panel @openPanel="renitialize(training)"type="primary">
                                                <strong  slot="header"><u>{{training.trainingTitle}}</u></strong>
                                                <h4 class="col-lg-8"><u>Sessions disponibles</u></h4>
                                                <div class="col-lg-4"><input type="checkbox" @click="disabling(training.id)">Indifférent</div>
                                                <div :id="training.id">
                                                <div  class="col-lg-12"  v-for="i in listTrainingSession">
                                                <div v-if="i.trainingDescription.id == training.id" >
                                                <sdiv :id="i.id">
                                                <input type="checkbox" v-model="checkedSessions" :value="i"><span id='i.value'> {{i.beginning}} - {{i.ending}} - {{i.location}}</div>
                                                <span></span>
                                                
                                                </div>
                                                </div>
                                                </div>
                                                <div class="col-lg-12">
                                                <center>
                                                <p style="color:#B22222" v-show="noSessionsSelectedError"> Vous n'avez sélectionné aucune session </p>
                                                <p style="color:green" v-show="addingRequestSucceeded"> Demande envoyée avec succès </p>
                                                <p style="color:blue" v-show="isNoSession"> Aucune session n'est prévue, vous pouvez néanmoins envoyer une demande</p>
                                                <button class="btn btn-primary" value="Envoyer une demande" @click="VerifyTrainingSessionCollaborator">Envoyer une demande</button>
                                                </center></div>
                                            </panel>
                                            </accordion>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`,
    beforeMount: function() {
        this.GetCookies();
        this.VerifyUserByDatabase();
    },
    mounted: function () {
        this.gatherTrainingsFromDatabase();
        this.GatherSessionsByTrainingFromDatabase();
    },
    computed: {
        searchFormatted: function () {
            if(this.value) return this.value.toUpperCase();
            else return '';
        }
    },

    methods: {
        VerifyUserByDatabase(){
            console.log(this.collaboratorIdentity.roles);
            if(this.collaboratorIdentity.roles)  window.location.pathname = '/addTrainingTopic.html';
        },
        disablingSessions(){
            for(i in this.sessionsByCollab){
                temp=document.getElementById(this.sessionsByCollab[i].id);
                temp.disabled =true;
                this.sessionAlreadyBookedMessage = true;
                temp.nextElementSibling.innerHTML="";
                $("#"+this.sessionsByCollab[i].id).after('<span>hello</span>');
            }
        },
        renitialize(training){
            this.checkedSessions.splice(0, this.checkedSessions.length);
            this.storeTrainingSessions(training.id);
            this.trainingSelected = training;
            this.storeCollabsByTraining(training.id);
            this.check = false;
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            this.sessionAlreadybooked.splice(0, this.sessionAlreadybooked.length);

        },
        disabling(id){
            this.check = !this.check;
            var nodes = document.getElementById(id).getElementsByTagName("*");
            if (this.check === true) {
                this.$http.get("api/formations/" + id + "/sessions").then(
                    function (response) {
                        this.checkedSessions.splice(0, this.checkedSessions.length)
                        this.checkedSessions = response.data;
                        if (this.checkedSessions.length === 0) {
                            this.isNoSession = true;
                        }
                        else {
                            this.isNoSession = false;
                        }
                    });
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = true;
                }
            }
            else {
                this.checkedSessions.splice(0, this.checkedSessions.length)
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].disabled = false;
                }
            }
        },
        displayTrainingsFn(){
            this.emptyTraining = this.selectedTraining ? false : true;
            this.trainingsFound.splice(0, this.trainingsFound.length);
            if (!this.emptyTraining) {
                this.$http.get("api/formations/" + this.selectedTraining + "/sessions").then(
                    function (response) {
                        this.listTrainingSession = response.data;
                        for (key in this.allTrainings) {
                            if (this.allTrainings[key].id == this.selectedTraining) {
                                this.trainingsFound.push(this.allTrainings[key]);
                            }
                        }
                        if (this.listTrainingSession.length === 0) {
                            this.displayTrainings = true;
                            this.isNoSession = true;
                        }
                        else {
                            this.displayTrainings = true;
                            this.isNoSession = false;
                        }
                    });
            }
        },
        gatherTrainingsFromDatabase(){
            this.$http.get("api/formations").then(
                function (response) {
                    this.allTrainings = response.data;
                    this.allTrainings.sort(function (a, b) {
                        return (a.trainingTitle > b.trainingTitle) ? 1 : ((b.trainingTitle > a.trainingTitle) ? -1 : 0);
                    });
                    this.selectTrainingTitles();
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        GetCookies(){
            let regexCookieToken = document.cookie.match('(^|;)\\s*' + "token" + '\\s*=\\s*([^;]+)');
            this.token = String(regexCookieToken.pop());
            this.collaboratorIdentity.id = jwt_decode(this.token).id;
            this.collaboratorIdentity.lastName = jwt_decode(this.token).lastName;
            this.collaboratorIdentity.firstName = jwt_decode(this.token).sub;
            this.collaboratorIdentity.roles = jwt_decode(this.token).roles;
        },
        GatherSessionsByTrainingFromDatabase(){
            this.$http.get("api/formations/" + this.idTraining + "/sessions").then(
                function (response) {
                    this.listTrainingSessions = response.data;
                });
        },
        VerifyTrainingSessionCollaborator(){
            //à changer
            this.addingRequestSucceeded = false;
            this.noSessionsSelectedError = false;
            if (this.isNoSession == true || this.checkedSessions.length != 0) {
                this.RequestToRegister.trainingDescription = this.trainingSelected;
                this.RequestToRegister.collaboratorIdentity = this.collaboratorIdentity;
                this.RequestToRegister.trainingSessionsDescriptions = this.checkedSessions;
                this.RequestToRegister = JSON.parse(JSON.stringify(this.RequestToRegister));
                console.log(this.RequestToRegister);
                this.SaveTrainingSessionCollaborator();
            } else {
                this.noSessionsSelectedError = true;
            }
        },
        SaveTrainingSessionCollaborator(){
            this.$http.post("api/requests", this.RequestToRegister).then(
                function (response) {
                    this.addingRequestSucceeded = true;
                },
                function (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            );
        },
        selectTrainingTitles(){
            for (index in this.allTrainings) {
                this.allTrainingTitles.push(this.allTrainings[index].trainingTitle)
            }
            console.log(this.allTrainingTitles);
        },
        storeTrainingsFound(){
            this.trainingsFound.splice(0, this.trainingsFound.length);
            this.displayTrainings = true;
            this.$http.get("api/formations").then(function(response){
                for (index in this.allTrainings) {
                    if (this.allTrainings[index].trainingTitle.indexOf(this.searchFormatted) != -1) {
                        this.trainingsFound.push(this.allTrainings[index]);
                    }
                }
                this.noTrainingFound = (this.trainingsFound.length == 0) ? true : false;
                this.value = null;
            });

        },
        storeCollabsByTraining(id){
            this.$http.get("api/formations/"+id+"/alreadyrequestedsession/"+ this.collaboratorIdentity.id).then(
                function (response){
                    this.sessionsByCollab = response.data;
                    console.log(this.sessionsByCollab);
                    this.disablingSessions();
                }

            )
        },
        storeTrainingSessions(id){
            this.$http.get("api/formations/" + id + "/sessions").then(
                function (response) {
                    this.listTrainingSession = response.data;
                    if (this.listTrainingSession.length === 0) {
                        this.displayTrainings = true;
                        this.isNoSession = true;
                    }
                    else {
                        this.displayTrainings= true;
                        this.isNoSession = false;
                    }
                });
        }


    }

})
Vue.component('typeahead', VueStrap.typeahead);
Vue.component('accordion', VueStrap.accordion);
Vue.component('panel', VueStrap.panel);