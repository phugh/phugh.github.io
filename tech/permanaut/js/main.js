var ls = !(window.localStorage == null)
var zx = 0

function calcSliders (x) {
  var sliderValues = []
  var total = 0
  var index
  var len
  sliderValues.push(parseInt($(x).val(), 10))
  for (index = 0, len = sliderValues.length; index < len; ++index) {
    total += sliderValues[index]
  };
  return total
};

function calculateScores () {
  // define our containers
  var PERMAScores = { 'Positive Emotion': 0, 'Engagement': 0, 'Relationships': 0, 'Meaning': 0, 'Accomplishment': 0 }
  var nTotal = 0
  var hTotal = 0
  var zTotal = 0
  var lonTotal = 0

  // get values from sliders, convert to readable number, and dump the results in the corresponding container then add them up
  $('input[id^=P]').each(function () {
    PERMAScores['Positive Emotion'] += calcSliders(this)
  })
  $('input[id^=E]').each(function () {
    PERMAScores['Engagement'] += calcSliders(this)
  })
  $('input[id^=R]').each(function () {
    PERMAScores['Relationships'] += calcSliders(this)
  })
  $('input[id^=M]').each(function () {
    PERMAScores['Meaning'] += calcSliders(this)
  })
  $('input[id^=A]').each(function () {
    PERMAScores['Accomplishment'] += calcSliders(this)
  })
  $('input[id^=N]').each(function () {
    nTotal += calcSliders(this)
  })
  $('input[id^=H]').each(function () {
    hTotal += calcSliders(this)
  })

  // these sliders are just single values so no containers are required
  lonTotal = (parseInt($('#LON').val(), 10).toFixed(2))
  zTotal = parseInt($('#Z1').val(), 10)

  // calculate overall wellbeing score
  var PERMATotal = 0
  for (var key in PERMAScores) {
    PERMATotal += PERMAScores[key]
  };
  var owTotal = (((PERMATotal + zTotal) / 16).toFixed(2))

  // calculate results to two decimal places
  var pFS = ((PERMAScores['Positive Emotion'] / 3).toFixed(2))
  var eFS = ((PERMAScores['Engagement'] / 3).toFixed(2))
  var rFS = ((PERMAScores['Relationships'] / 3).toFixed(2))
  var mFS = ((PERMAScores['Meaning'] / 3).toFixed(2))
  var aFS = ((PERMAScores['Accomplishment'] / 3).toFixed(2))
  var nFS = ((nTotal / 3).toFixed(2))
  var hFS = ((hTotal / 3).toFixed(2))

  // find highest and lowest areas and print list
  var keysSorted = Object.keys(PERMAScores).sort(function (a, b) { return PERMAScores[b] - PERMAScores[a] })
  var PERMAEqual = { 'Positive Emotion': 15, 'Engagement': 15, 'Relationships': 15, 'Meaning': 15, 'Accomplishment': 15 }
  if (_.isEqual(PERMAScores, PERMAEqual)) {
    console.log('PERMA Scores are all 5s, not printing list.')
  } else {
    $('#highestresult').text('Highest to lowest: ' + keysSorted.join(', '))
  };

  // Display text
  $('.pRes').text(pFS)
  $('.eRes').text(eFS)
  $('.rRes').text(rFS)
  $('.mRes').text(mFS)
  $('.aRes').text(aFS)
  $('.nRes').text(nFS)
  $('.hRes').text(hFS)
  $('.owRes').text(owTotal)
  $('.lonRes').text(lonTotal)

  // hide the testCards and scroll to the top of the page
  $('#quizPane').hide()
  window.scrollTo(0, 0)
  $('#resultsPane').fadeIn('fast')

  // generate chart
  var data = {
    labels: ['P', 'E', 'R', 'M', 'A', 'N', 'H', 'OW'],
    datasets: [
      {
        label: 'Your Results',
        backgroundColor: '#2196f3',
        data: [pFS, eFS, rFS, mFS, aFS, nFS, hFS, owTotal]
      }
    ]
  }

  var dataCompare = {
    labels: ['P', 'E', 'R', 'M', 'A', 'N', 'H', 'OW'],
    datasets: [
      {
        label: 'Your Results',
        backgroundColor: '#2196f3',
        data: [pFS, eFS, rFS, mFS, aFS, nFS, hFS, owTotal]
      },
      {
        label: 'Average',
        backgroundColor: '#00bcd4',
        data: [6.79, 7.41, 6.99, 7.17, 7.37, 7.14, 4.49, 7.03]
      }
    ]
  }

  var opts = {
    scales: {
      yAxes: [{
        ticks: {
          max: 10,
          min: 0,
          stepSize: 1,
          beginAtZero: true
        }
      }]
    }
  }

  var ctx = document.getElementById('resultsChart').getContext('2d')
  if ($('#goCompare').prop('checked')) {
    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: dataCompare,
      options: opts
    })
  } else {
    var myBarChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: opts
    })
    $('#keyText').hide()
  }

  // print results page header
  var d = new Date()
  var month = d.getMonth() + 1
  var day = d.getDate()
  var outputDate = (('' + day).length < 2 ? '0' : '') + day + '/' +
    (('' + month).length < 2 ? '0' : '') + month + '/' +
    d.getFullYear()

  var inp = $('#nameInput').val()
  var tinp = $.trim(inp)
  if (tinp.length > 0) {
    $('#topText').text('PERMAnaut - ' + inp + "'s PERMA Profile - " + outputDate)
  } else {
    $('#topText').text('PERMAnaut - ' + 'PERMA Profile Results - ' + outputDate)
    tinp = 'Anon'
  }

  if (ls) {
    var lsd = { 'Name': tinp, 'DateString': d, 'Date': outputDate, 'P': pFS, 'E': eFS, 'R': rFS, 'M': mFS, 'A': aFS, 'N': nFS, 'H': hFS, 'L': lonTotal, 'O': owTotal }
    window.localStorage.setItem('PNS' + (zx + 1), JSON.stringify(lsd))
  }
};

function updatevalues (x) {
  // update slider label according to slider value
  $(x).next('span').next('span').text(x.value)
};

function nextBlock (x) {
  // hide the current block, find the next one and show it
  var thisBlock = $(x).closest('div.block')
  $(thisBlock).hide()
  $(thisBlock).next('div.block').show()
};

function postToFeed () {
  var obj = {
    method: 'feed',
    link: 'http://www.phugh.es/tech/permanaut/',
    description: 'I just got a wellbeing score of ' + $('.owRes').text() + '/10, what will you get?',
    picture: 'http://www.phugh.es/tech/permanaut/tile-wide.png',
    name: 'PERMAnaut Wellbeing Quiz'
  }
  FB.ui(obj)
}

function getPreviousScores () {
  if (zx !== 0) {
    for (var i = 0; i < zx; i++) {
      var retrievedObject = localStorage.getItem('PNS' + (i + 1))
      var q = JSON.parse(retrievedObject)
      $('.tbody').append('<tr><td>' + q.Name + '</td><td>' + q.Date +
                '</td><td>' + q.P + '</td><td>' + q.N +
                '</td><td>' + q.E + '</td><td>' + q.R +
                '</td><td>' + q.M + '</td><td>' + q.A +
                '</td><td>' + q.H + '</td><td>' + q.L +
                '</td><td>' + q.O + '</td></tr>')
    }
    $('.prevResTable').show()
  }
}

function clearPreviousScores () {
  $('.tbody').empty()
  $.each(localStorage, function (i, v) {
    if (i.match(/^PNS/)) {
      localStorage.removeItem(i)
    }
  })
  Materialize.toast('Previous scores cleared', 2500)
}

$(document).ready(function () {
  // hide results pages
  $('#resultsPane').hide()
  $('.prevResTable').hide()

  // test localStorage availability
  if (ls) {
    ls = 1
    $.each(localStorage, function (i, v) {
      if (i.match(/^PNS/)) {
        zx += 1
      }
    })
    getPreviousScores()
  } else {
    ls = 0
    Materialize.toast('localStorage unavailable. Score saving disabled.', 4000)
  }

  // hide all test blocks except the first
  $('.block').not(':first').hide()

  // set some global chart options
  Chart.defaults.global.responsive = true

  window.fbAsyncInit = function () {
    FB.init({
      appId: '1096633653680137',
      xfbml: true,
      version: 'v2.5'
    })
  }
});

// init facebook
(function (d, s, id) {
  var js
  var fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) { return }
  js = d.createElement(s); js.id = id
  js.src = '//connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
}(document, 'script', 'facebook-jssdk'))
