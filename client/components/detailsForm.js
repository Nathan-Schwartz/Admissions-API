var m = require('mithril')
var Menu = require('./menu')

// TODO: data validation, post request

module.exports.controller = function (options) {
  var ctrl = this;
  ctrl.interview = {
    interviewerName: "",
    decisionNotes: "",
    blackoutPeriod: 0,
    technicalGrade: "",
    technicalGradeNotes: "",
    personalGrade: "",
    personalGradeNotes: ""
  };

  ctrl.createInterview = function(){

    if(App.userInfo === undefined || App.userInfo.email === undefined)
      throw new Error("We needed an email and didn't get one.")

    var dataWithUserInfo = Object.assign({}, ctrl.interview, App.userInfo)

    m.request({
      method: "POST",
      url: "/api/interview/create",
      data: dataWithUserInfo
    })
    .then(function(results){
      console.log("results from post", arguments)
    })
    .catch(function(results){
      console.log("ERROR: results from post", arguments)
    })
  }
}

module.exports.view = function (ctrl, options) {
  var data = ctrl.interview;

  return m('span',[
    m(Menu),
    m('span.content', [
      m('h1', "Interview Details"),
      m('form.user-info', {
        onsubmit: function(e){
          e.preventDefault();
          data.interviewerName = document.getElementById("interviewer-name").value;
          data.decisionNotes = document.getElementById("decision-notes").value;
          data.technicalGrade = document.getElementById("technical-grade").value;
          data.technicalGradeNotes = document.getElementById("technical-grade-notes").value;
          data.personalGrade = document.getElementById("personal-grade").value;
          data.personalGradeNotes = document.getElementById("personal-grade-notes").value;

          if(data.blackoutPeriod === "Soft Reject")
            data.blackoutPeriod = document.getElementById("blackout-period").value;

          // TODO: Error handling? Form validation?
          ctrl.createInterview();
          m.route('/')
        }
      },[
        m('div.caption', 'Intervier\'s Name'),
        m('select#interviewer-name', [
            m('option[value=""]', "-Choose an Interviewer-"),
            ...App.interviewers.map(name => m('option[value='+name+']', name))
        ]),
        m('br'),
        m('div.caption', 'Admission Recommendation'),
        m('select#interview-decision', {
          onchange: function(e){
            // TODO: is there a better way to grab the value of this select menu
            data.decision = document.getElementById("interview-decision").value
            m.redraw()
          }
        },[
          m('option[value=""]', "-Decision-"),
          m('option[value="Accept"]', "Accept"),
          m('option[value="Conditional Accept"]', "Conditional Accept"),
          m('option[value="Soft Reject"]', "Soft Reject"),
          m('option[value="Hard Reject"]', "Hard Reject")
        ]),

        data.decision !== "Soft Reject"
         ? null 
         : m('div',[
             m('div.caption', 'How long should they wait before re-interviewing? (weeks)'),
             m('input#blackout-period[type="number"]'),
           ]),
        m('br'),

        m('div.caption', 'Decision Reasoning'),
        m('textarea#decision-notes', {rows:"4",placeholder:"Why?"}),

        m('br'),

        m('div.caption', 'Personal Grade'),
        m('select#personal-grade', [
          m('option[value=""]', "-Choose a Personal Grade-"),
          m('option[value="A"]', "A"),
          m('option[value="B"]', "B"),
          m('option[value="C"]', "C"),
          m('option[value="D"]', "D"),
          m('option[value="F"]', "F")
        ]),

        m('br'),

        m('div.caption', 'Reasons for Personal Grade'),
        m('textarea#personal-grade-notes', {rows:"4",placeholder:"Why?"}),

        m('br'),

        m('div.caption', 'Technical Grade'),
        m('select#technical-grade', [
          m('option[value=""]', "-Choose a Technical Grade-"),
          m('option[value="A"]', "A"),
          m('option[value="B"]', "B"),
          m('option[value="C"]', "C"),
          m('option[value="D"]', "D"),
          m('option[value="F"]', "F")
        ]),

        m('br'),
        m('div.caption', 'Reasons for Technical Grade'),
        m('textarea#technical-grade-notes', {rows:"4",placeholder:"Why?"}),

        m("br"),
        m('button.button-inverse-ghost[type=submit]', "Submit")
      ]),
    ])
  ])
}
