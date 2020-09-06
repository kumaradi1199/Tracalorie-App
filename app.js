//storage controller

//item controller
const ItemCtrl = (function () {

    //item constructor
    const Item = function (id,name,calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    //data structure / State
    const data = {
        items: [
            // {id: 0,name:'Sandwich',calories: 500},
            // {id: 1,name:'Pizza',calories: 700},
            // {id: 2,name:'Pasta',calories: 400}
        ],
        currentItem: null,
        totalCalories: 0
    }


    return{

        getItems: function () {
            return data.items;
        },

        addItem: function (name,calories) {
            //ID
            let ID; 
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id + 1; 
            }else{
                ID=0;
            }

            const cals = parseInt(calories);

            newItem = new Item(ID,name,cals);
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(item=>{
                total+=item.calories;
            });
            
            data.totalCalories = total;
            return data.totalCalories;
        },

        logdata: function () {
            return data;
        }
    }
})();

//UI Controller
const UICtrl = (function () {
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemName: '#item-name',
        itemCalories: '#item-calories',
        totalCalories: '.total-calories'
    };

    //public selectors
    return{
        populateItemList: function (item) {
            let html = ``;
            item.forEach(item => {
                html += ` <li id="item-${item.id}" class="collection-item">
                <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`;
            });
            document.querySelector('#item-list').innerHTML= html;
        },

        getSelectors: function () {
            return UISelectors;
        },
        getItemInput: function () {
            return{
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        addListItem: function (item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `collection-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;

            //insert
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
            //unhide list
            document.querySelector(UISelectors.itemList).style.display = 'block';
        },
        addTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearFields: function () {
            document.querySelector(UISelectors.itemName).value = '';
            document.querySelector(UISelectors.itemCalories).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        }
    }
})();
//App Controller
const App = (function () {
    //Load Event Listeners
    const loadEventListeners = function () {
    
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemSubmit);
    }

    //add item
    const itemSubmit = function (e) {

        //get input and add
        const input = UICtrl.getItemInput();
        if(input.name!=='' && input.calories!==''){
            const newItem = ItemCtrl.addItem(input.name,input.calories);
            
        //Add to UI
        UICtrl.addListItem(newItem);
        
        //total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.addTotalCalories(totalCalories);

        UICtrl.clearFields();
        }


        e.preventDefault();
    }

    //public methods
    return{
        init: function () {
            console.log('init app');
            const items = ItemCtrl.getItems();
            //hide empty list
            if(items.length===0){
                UICtrl.hideList();
            }else{
            //populate list
            UICtrl.populateItemList(items);

            //total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.addTotalCalories(totalCalories);
            }
            //load event listeners
            loadEventListeners();

        }
    }
})();

App.init();