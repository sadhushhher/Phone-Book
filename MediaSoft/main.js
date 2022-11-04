let users = {};

function generator(search) {
    document.getElementById("contacts").innerHTML = "";

    let temporary = [];

    let nomer = 0;
    
    if (!search) {
        for (var key in users) {
            temporary[nomer] = [key, users[key][0], users[key][1]];
            nomer++;
        }
    }else {
        for (var key in users) {
            if(users[key][0].toUpperCase().search(search) != -1 || users[key][0].toLowerCase().search(search) != -1) {
                temporary[nomer] = [key, users[key][0], users[key][1]];
                nomer++;
            }
        }
        if (!temporary.length) {
            document.getElementById("contacts").innerHTML = "<div class='empty'>Записи не найдены!</div>";
        }
    }


    temporary.sort(
        function(a, b) {
          if (a[1].toLowerCase() < b[1].toLowerCase()) return -1;
          if (a[1].toLowerCase() > b[1].toLowerCase()) return 1;
          return 0;
        }
    );
      

    for (let i = 0; i < temporary.length; i++){
        for (let j = 0; j < temporary.length-1; j++){
            if (temporary[j][2] < temporary[j + 1][2]) {
                let zam = temporary[j];
                temporary[j] = temporary[j + 1];
                temporary[j + 1] = zam;
            }
        }
    }

    for (let i = 0; i < temporary.length; i++){
        if(temporary[i][2] > 0) {
            like = `<i class="fa fa-heart fa-btn" aria-hidden="true" id="${'liked-' + temporary[i][0]}" onclick="liked(this.id)"></i>`;
        }else {
            like = `<i class="fa fa-heart-o fa-btn" aria-hidden="true" id="${'liked-' + temporary[i][0]}" onclick="liked(this.id)"></i>`;
        }

        document.getElementById("contacts").innerHTML += `
        <div class='item' id='${'item-' + temporary[i][0]}'>
            <div class='icon'></div>
            <div class='item-text'>
                <p class='p-name'>${temporary[i][1]}</p>
                <p class='p-phone'>${temporary[i][0]}</p>
            </div>
            <div class='buttom-wrap'>
                <i id='${'del-' + temporary[i][0]}' onclick='del(this.id)' class='fa fa-times fa-btn' aria-hidden='true'></i>
                ${like}
            </div>
        </div>`;
    }
}

if (Object.keys(users).length === 0){
    document.getElementById("contacts").innerHTML = "<div class='empty'>Пусто...</div>";
}

function buttomAdd() {
    document.getElementById("add").style.display = "flex";
    document.getElementById("list").style.display = "none";
}

window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('.tel'), function(input) {
    var keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        var pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        var matrix = "+7 (___) ___ ____",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});

function buttomСreate() {
    let name = document.getElementById("input-name").value;
    let phone = document.getElementById("input-phone").value;
    let like = document.getElementById("favorites").checked;

    if(!name) {
        alert("Поле имя пустое!");
    }else {
        if (name.length <= 2) {
            alert("Поле имя слишком короткое!");
        }else {
            if (name.length >= 15) {
                alert("Поле имя слишком длинное!");
            }else {
                if(!/^[A-ZА-ЯЁ]+$/i.test(name)) {
                    alert("Поле имя некоректно!");
                }else {
                    if(!phone) {
                        alert("Поле телефон пустое!");
                    }else {
                        if (phone.length < 17) {
                            alert("Номер телефона слишком короткий!");
                        }else {
                            if(phone in users) {
                                alert("Номер телефона уже зарегистрирован");
                            }else {
                                users[phone] = [name, like];

                                generator(false);

                                document.getElementById('input-name').value = "";
                                document.getElementById('input-phone').value = "";
                                document.getElementById('favorites').checked = false;

                                document.getElementById("add").style.display = "none";
                                document.getElementById("list").style.display = "flex";
                            }
                        }
                    }
                }
            }
        }
    }
}

function del(id) {

    id = id.split("-");

    if(id[1] in users) {
        delete users[id[1]];
        document.getElementById('item-' + id[1]).remove();
    }
    if (Object.keys(users).length === 0){
        document.getElementById("contacts").innerHTML = "<div class='empty'>Пусто...</div>";
    }
} 

function liked(id) {

    id = id.split("-");

    for (var key in users) {
        if(key == id[1]){
            users[key][1] = !users[key][1];
        }
    }

    generator(false);
}

function buttomSearch() {
    let search = document.getElementById('search').value;

    if (Object.keys(users).length) {
        if(!search) {
            generator(false);
        }else {
            if (search.length >= 15) {
                alert("Поле поиск слишком длинное!");
            }else {
                if (!/^[A-ZА-ЯЁ]+$/i.test(search)) {
                    alert("Поле поиск некоректно!");
                }else {
                    generator(search);
                }
            }
        }
    }

}

function buttomContact() {
    generator(false);
    document.getElementById('search').value = "";
}

document.addEventListener( 'keyup', event => {
    let search = document.getElementById('search').value;
    if( event.code === 'Enter' ) 
    {
        if (Object.keys(users).length) {
            generator(search);
        }
    }
});

function emptySearch() {
    let search = document.getElementById('search').value;
    if (search.length) {
        generator();
    }
}


