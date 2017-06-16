/**
 * Created by BBA3616 on 15/05/2017.
 */
let collectWishes = Vue.component('collect-wishes', {
    props: [],

    data: function () {
        return {
            showChevrons: false,
            allWishes: [],
            listWishesToUpdate: [],
            showConfirmUpdateWishesMessage: false
        }
    },

    template: `
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-sm-12 col-md-10 col-lg-12">
                            <div class="row">
                                <div class="col-lg-9 col-md-9 text-center">
                                    <legend>Souhaits reçus</legend>
                                </div>
                            </div>
                            <div class="row">
                                <div id="collectWishes">
                                    <div class="row">
                                        <div class="col-sm-12 col-md-2 col-lg-2">
                                            <router-link :to="{path: '/addTrainingTopic'}">
                                            <img src="css/left-arrow.png"
                                                 width="40"
                                                 height="40"
                                                 style="cursor: pointer;">
                                            </router-link>
                                        </div>
                                        <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-2 col-md-offset-2 col-lg-offset-2">
                                            <br/>
                                            <img v-show="showChevrons"
                                                 src="css/up.png"
                                                 id="scroll-up-3"
                                                 width="60"
                                                 height="20"
                                                 style="position: absolute; 
                                                 left:50%; 
                                                 z-index:1;">
                                        </div>
                                    </div>
                                    <div id="scroll"
                                         style="width: 100%; 
                                                height: 470px; 
                                                overflow-y:hidden; 
                                                overflow-x:hidden;">
                                        <div class="row">
                                            <ol style="list-style-type:none" class="rectangle-list">
                                                <li v-for="wish in allWishes">
                                                    <a :title="wish.label">
                                                        <img v-if="wish.checked==true"
                                                             @click="addWishToListWishes(wish, false)"
                                                             src="img/validate_icon.png"
                                                             width="25"
                                                             height="25"
                                                             style="margin-left:50px; 
                                                                    cursor:pointer;">
                                                        <img v-else-if="wish.checked==null"
                                                             @click="addWishToListWishes(wish, true)"
                                                             src="img/validate_icon_init.png"
                                                             width="25"
                                                             height="25"
                                                             style="margin-left:50px; 
                                                                    cursor:pointer;">
                                                        <img v-else-if="wish.checked ==false"
                                                             @click="addWishToListWishes(wish, true)"
                                                             src="img/refuse_icon.png"
                                                             width="25"
                                                             height="25"
                                                             style="margin-left:50px; 
                                                                    cursor:pointer;">
                                                        <img src="img/thumbs_up.png"
                                                             width="25"
                                                             height="25"
                                                             style="margin-left:90px;">
                                                        <span style="color:#8c8c8c">
                                                              {{ wish.vote_ok.length}} votes
                                                        </span>
                                                        <img src="img/thumbs_down.png"
                                                             width="25"
                                                             height="25"
                                                             style="margin-left:20px;">
                                                        <span style="color:#8c8c8c">
                                                              {{ wish.vote_ko.length }} votes
                                                        </span>
                                                    </a>
                                                </li>
                                            </ol>
                                        </div>
                                    </div>
                                    <div clas="row">
                                        <div class="col-sm-12 col-md-3 col-lg-3 col-sm-offset-4 col-md-offset-4 col-lg-offset-4">
                                            <img v-show="showChevrons"
                                                 src="css/down.png"
                                                 id="scroll-down-3"
                                                 width="60" height="20"
                                                 style="position: absolute; 
                                                        left:50%; top:95%; 
                                                        z-index:1;">
                                        </div>
                                        <div style="width: 100%; height: 30px;">
                                            <br/>
                                            <span v-show="showConfirmUpdateWishesMessage"
                                                  class="text-center color-green"
                                                  style="margin-left:153px;
                                                         margin-top:20px;"
                                                         height="80px"
                                                         width="250px">
                                                  Vos modifications ont bien été enregistrées
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
`,
    mounted: function () {
        Object.setPrototypeOf(this, BaseComponent(Object.getPrototypeOf(this)));
        this.activateScrollUp('#scroll-up-3', '#scroll');
        this.activeScrollDown('#scroll-down-3', '#scroll');
        this.getAllWishes();
    },
    methods: {

        addWishToListWishes(wish, isWishValidate){
            wish.checked = isWishValidate;
            this.listWishesToUpdate.push(wish);
            this.updateWish();
        },

        getAllWishes(){
            let sortWishesFromTheYoungestToTheOldest = () => {
                this.allWishes.sort(function (a, b) {
                    return (a.id < b.id) ? 1 : ((b.id < a.id) ? -1 : 0);
                });
            };

            let gatherAllWishesSuccess = (response) => {
                if (response) {
                    let self=this;
                    console.log("success to get all wishes");
                    this.allWishes = response.data;
                    sortWishesFromTheYoungestToTheOldest();
                    setTimeout(function(){
                        self.showChevrons = self.checkForChevrons("scroll")
                    },0)
                }
            };
            let gatherAllWishesError = (response) => {
                if (response) {
                    console.log("Error: ", response);
                    console.error(response);
                }
            };
            this.get("api/allwishes", gatherAllWishesSuccess, gatherAllWishesError);
        },

        updateWish(){
            let isAdminChooseAtLeastOneWishToUpdate = this.listWishesToUpdate.length > 0;
            if (isAdminChooseAtLeastOneWishToUpdate) {
                let updateSuccess = (response) => {
                    if (response) {
                        console.log("success to update wishes");
                        this.listWishesToUpdate = [];
                    }
                };
                let updateError = (response) => {
                    if (response) {
                        console.log("Error: ", response);
                        console.error(response);
                    }
                };
                this.post("api/ischeckedwishestoupdate", this.listWishesToUpdate, updateSuccess, updateError);
            }
        }
    }

});