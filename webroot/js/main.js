var room_id = 1;

function init() {
    registerHandlerForUpdateCurrentPriceAndFeed();
};

function registerHandlerForUpdateCurrentPriceAndFeed() {
    var eventBus = new EventBus('http://localhost:8080/eventbus');
    eventBus.onopen = function () {
        eventBus.registerHandler('room.' + room_id, function (error, message) {
            document.getElementById('feed').value += JSON.parse(message.body).message + '\n';
        });
    }
};

function bid() {
    var message = document.getElementById('my_bid_value').value;
    fetch("http://localhost:8080/api/rooms/" + room_id, {method: "PATCH", body: JSON.stringify({message, message})}).then(res => {
    console.log(res)
      if (res.status === 200) {
        document.getElementById('error_message').innerHTML = '';
      } else {
        throw res;
      }
    }).catch(e => {
      document.getElementById('error_message').innerHTML = 'Message failed';
    });
};
