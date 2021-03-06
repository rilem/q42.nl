
Meteor.startup(() => {
  Meteor.subscribe("chat");
  Session.setDefault("openChat", false);
});

ChatMessages.after.insert(() => $("#chat .flex-stretch").scrollTop(99999));

sendChatMessage = () => {
  check(Meteor.user(), Object);

  let $input = $(Template.instance().find("input"));
  const msg = $input.val();

  check(msg, String);

  ChatMessages.insert({
    userId: Meteor.userId(),
    msg: msg,
    date: new Date(),
    path: window.location.href
  });

  $input.val("");
  $input.focus();
};

$Events("header", {
  "click #chat-toggle": function(evt) {
    Session.set("openChat", !Session.get("openChat"));
  }
});

Template.chat.helpers({
  message() { return ChatMessages.find({}, {sort: {date: 1}}); },
  user() {
    let user = Meteor.users.findOne(this.userId);
    if (user && user.profile && user.profile.name)
      return user.profile.name;
    else if (this.username) {
      return this.username;
    }
    else {
      return "Unknown";
    }
  }
});

Template.chat.events({
  "click .close": function(evt) {
    evt.preventDefault();
    Session.set("openChat", false);
  },
  "click button": () => sendChatMessage(),
  "keyup input": function(evt) { if (evt.which === 13) sendChatMessage(); }
});

Template.chat.onRendered(() => {
  const $input = $(Template.instance().find("input"));
  $input.focus();
});
