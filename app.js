// //storage controller
const StorageCtrl = (function () {

    return{
        storeItem: function (item) {
            let items = [];
            
            if(localStorage.getItem('items')===null){
                items = [];
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
            else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items',JSON.stringify(items));
            }
          },

          getItemsFromStorage: function () {
            let items = [];
            if(localStorage.getItem('items')===null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                }
            return items;
            },

          updateItemStorage: function (updatedItem) {
              let items = JSON.parse(localStorage.getItem('items'));
              items.forEach((item,index) => {
                  if(updatedItem.id === item.id ){
                      items.splice(index,1,updatedItem);
                  }
              });

              localStorage.setItem('items',JSON.stringify(items));
            },
            deleteItemStorage: function (id) {
                let items = JSON.parse(localStorage.getItem('items'));
                items.forEach((item,index) => {
                    if(item.id === id){
                        items.splice(index,1);
                    }                    
                });
                console.log(items);
                localStorage.setItem('items',JSON.stringify(items));
            },
            clearFromStorage: function () {
                localStorage.removeItem('items');
            }
    }
  })();

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
        items: StorageCtrl.getItemsFromStorage(),
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
                total += item.calories;
            });
            
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById: function (id) {
            let found = null;
            data.items.forEach((item)=>{
                if(item.id===id){
                    found = item;
                }
            });
           
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },

       
        updateItem: function (name,calories) {
           calories = parseInt(calories);
            data.items.forEach(item => {
                if(item.id===data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deletetem: function (id) {
            ids = data.items.map(item => {
                return item.id;
            });
           
            index = ids.indexOf(id);
            console.log(index);
            data.items.splice(index,1);
        },
        
        deleteAllItems: function () {
            data.items = [];
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
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        listItems: '#item-list li',
        clearBtn: '.clear-btn'
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
            li.id = `item-${item.id}`;
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
        },
        clearEditState: function () {
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemToUI: function () {
          
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
          showEditState: function () {
           
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updatedItemUI: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            //console.log(listItems);
            listItems.forEach(listItem =>{
                const itemId = listItem.getAttribute('id');
                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
                }
            });

        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },

        clearAllItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);

            listItems.forEach(item => {
                item.remove();
            });
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
        //back button
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
        //deletebutton
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDelete);
        //clear button
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAll);

        //disable submit on enter
        document.addEventListener('keypress',function (e) {
            if(e.keyCode === 13){
                e.preventDefault();
                return false;
            }
        });

        //edit icon click
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditUI);

        //update item in data
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdate);
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
        console.log(newItem);

        //local storage
        StorageCtrl.storeItem(newItem);

        UICtrl.clearFields();
        }

        e.preventDefault();
    }

    //item edit UI changes
    const itemEditUI = function (e) {
        if(e.target.classList.contains('edit-item')){
            //get item id
            const listId = e.target.parentNode.parentNode.id;
            const listidArray = listId.split('-');
             const id = parseInt(listidArray[1]);

             const itemToEdit = ItemCtrl.getItemById(id);
             
            
             //set current item
             ItemCtrl.setCurrentItem(itemToEdit);

             UICtrl.addItemToUI();
        }
    }

    //item update
    const itemUpdate = function (e) {
        const input = UICtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name,input.calories);
        UICtrl.updatedItemUI(updatedItem);
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.addTotalCalories(totalCalories);
        UICtrl.clearFields();
        UICtrl.clearEditState();

        //upadate local storage
        StorageCtrl.updateItemStorage(updatedItem);
        
       e.preventDefault();
    }

    //item delete
    const itemDelete = function (e) {
       const currentItem = ItemCtrl.getCurrentItem();
       ItemCtrl.deletetem(currentItem.id);

       //delete from ui
       UICtrl.deleteListItem(currentItem.id);

       const totalCalories = ItemCtrl.getTotalCalories();
       UICtrl.addTotalCalories(totalCalories);
       StorageCtrl.deleteItemStorage(currentItem.id);
       console.log(currentItem.id);
       UICtrl.clearFields();
       UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAll = function (e) {
        ItemCtrl.deleteAllItems();
        UICtrl.clearAllItems();
        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.addTotalCalories(totalCalories);
        UICtrl.clearEditState();
        UICtrl.clearFields();
        StorageCtrl.clearFromStorage();
        UICtrl.hideList();

        e.preventDefault();
    }

    //public methods
    return{
        init: function () {
            console.log('init app');
            UICtrl.clearEditState();
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