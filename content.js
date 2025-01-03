// Remove duplicate message listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle getSelectedText message
  if (request.type === 'getSelectedText') {
    const selectedText = window.getSelection().toString().trim();
    sendResponse({ selectedText: selectedText || null });
    return false;  // No need to keep message channel open
  }
  
  // Handle analyzePlainLanguage message
  if (request.type === 'analyzePlainLanguage') {
    if (!request.text) {
      sendResponse({ 
        score: '-', 
        feedback: "No text provided for analysis" 
      });
      return false;
    }
    
    const analysis = analyzePlainLanguage(request.text);
    sendResponse(analysis);
    return false;  // Synchronous response
  }
});

// Function to convert Dale-Chall word list to JavaScript array
function convertDaleChallWords(wordList) {
  return wordList
    .split('\n')           // Split the text into lines
    .map(word => word.trim())  // Remove leading/trailing whitespace
    .filter(word => word.length > 0)  // Remove empty lines
    .map(word => word.replace(/'/g, "\\'"));  // Escape apostrophes
}

function analyzePlainLanguage(text) {
  // Ensure we have text to analyze
  if (!text || text.trim().length === 0) {
    return {
      score: 0,
      feedback: "No text provided for analysis"
    };
  }

  // Initialize score and feedback array
  let score = 100;
  const feedback = [];
  
  // Split text into various components
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const words = text.split(/\s+/);

  // Average words per sentence
  const avgWordsPerSentence = words.length / sentences.length;
  
  if (avgWordsPerSentence > 20) {
    score -= 10;
    feedback.push("Sentences are too long. Aim for 20 words or fewer per sentence.");
  }

  // Complex word detection (words with 3+ syllables)
  const complexWordRegex = /[aeiou]{3,}/gi;
  const complexWords = words.filter(word => 
    (word.match(complexWordRegex) || []).length >= 3
  );
  
  if (complexWords.length / words.length > 0.1) {
    score -= 10;
    feedback.push("Too many complex words. Consider using simpler alternatives.");
  }

  // Passive voice detection
  const passiveRegex = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  const passiveMatches = text.match(passiveRegex) || [];
  
  if (passiveMatches.length > 0) {
    score -= passiveMatches.length * 5;
    feedback.push("Consider using active voice instead of passive voice.");
  }

//   const daleChallWords = convertDaleChallWords(`A
// A.M.
// America
// American
// April
// August
// B
// C
// Christmas
// Creep
// D
// D.C.
// Dad
// December
// Easter
// Eskimo
// F
// February
// Friday
// G
// George Washington
// God
// Halloween
// I
// I'd
// I'll
// I'm
// I've
// Indian
// It
// It'll
// It's
// Its
// J
// January
// July
// June
// K
// L
// Lincoln, Abraham
// London
// M
// Monday
// Mr.
// Mrs.
// N
// November
// O.K.
// October
// P
// P.M.
// Pa
// R
// S
// Saturday
// September
// Sir
// Sis
// So
// Sunday
// T
// TV
// Thanksgiving
// Thursday
// Tuesday
// U
// U.S.
// U.S.A.
// V
// Valentine
// W
// Washington
// Wednesday
// X
// Xmas
// Y
// Z
// able
// aboard
// about
// above
// absent
// ac
// accept
// accident
// account
// ace
// ache
// acid
// acorn
// across
// action
// add
// addition
// address
// adjust
// adjustment
// admire
// admission
// adore
// adult
// adventure
// advice
// afraid
// after
// afternoon
// afterward
// afterwards
// again
// against
// age
// ago
// agree
// ah
// ahead
// aid
// aim
// air
// airline
// airplane
// airport
// airy
// alarm
// album
// alike
// alive
// all
// alley
// alligator
// allright
// almost
// alone
// along
// alongside
// aloud
// alphabet
// already
// also
// always
// am
// amaze
// amazement
// among
// amount
// an
// and
// angel
// anger
// angry
// animal
// ankle
// announce
// announcement
// another
// answer
// ant
// any
// anybody
// anyhow
// anyone
// anything
// anyway
// anywhere
// apart
// apartment
// ape
// apiece
// appear
// applause
// apple
// apron
// are
// area
// aren't
// arise
// arithmetic
// arm
// army
// around
// arrange
// arrest
// arrive
// arrow
// arrowhead
// art
// artist
// as
// ash
// aside
// ask
// asleep
// astronaut
// at
// ate
// atlas
// attack
// attend
// attention
// aunt
// author
// auto
// automobile
// autumn
// avenue
// awake
// awaken
// award
// away
// awful
// awhile
// ax
// baa
// baby
// baby-sitter
// back
// backache
// background
// backtrack
// backward
// backwards
// bacon
// bad
// badge
// bag
// baggage
// bait
// bake
// bakery
// balance
// ball
// balloon
// ballpoint
// banana
// band
// bandage
// bang
// banjo
// bank
// bar
// barbecue
// barber
// bare
// barefoot
// bark
// barn
// barrel
// base
// baseball
// basement
// basket
// basketball
// bat
// bath
// bathe
// bathroom
// battle
// be
// beach
// bead
// beak
// beam
// bean
// bear
// beard
// beast
// beat
// beautiful
// beauty
// beaver
// became
// because
// become
// bed
// bedroom
// bedspread
// bee
// beef
// beefsteak
// been
// beer
// beet
// before
// beg
// began
// beggar
// begin
// begun
// behave
// behind
// belief
// believe
// bell
// belly
// belong
// belonging
// belongings
// below
// belt
// bench
// bend
// beneath
// bent
// berry
// beside
// besides
// best
// bet
// better
// between
// beyond
// bib
// bible
// bicycle
// big
// bigness
// bill
// billfold
// billion
// bingo
// bird
// birth
// birthday
// biscuit
// bit
// bite
// bitter
// black
// blackboard
// blackness
// blacksmith
// blame
// blank
// blanket
// blast
// blastoff
// blaze
// bleed
// bless
// blew
// blind
// blindfold
// blink
// blinker
// block
// blond
// blonde
// blood
// bloodhound
// bloodstream
// bloom
// blossom
// blot
// blouse
// blow
// blue
// blueberry
// blush
// board
// boat
// bobwhite
// body
// bodyguard
// boil
// bold
// bolt
// bomb
// bone
// bonnet
// boo
// book
// boom
// boot
// born
// borrow
// boss
// both
// bother
// bottle
// bottom
// bought
// boulder
// bounce
// bow
// bow-wow
// bowl
// box
// boxcar
// boy
// brace
// bracelet
// brain
// brake
// bran
// branch
// brand
// brand-new
// brass
// brave
// bravery
// bread
// break
// breakfast
// breast
// breath
// breathe
// breeze
// brick
// bride
// bridge
// bright
// brighten
// bring
// broad
// broadcast
// broke
// broken
// broken-hearted
// brook
// broom
// brother
// brought
// brown
// brownie
// brush
// bubble
// bucket
// buckle
// bud
// budge
// buffalo
// bug
// buggy
// build
// building
// bulb
// bull
// bullet
// bulletin
// bumblebee
// bump
// bumpy
// bun
// bunch
// bundle
// bunk
// bunny
// burglar
// burn
// burnt
// burro
// burst
// bury
// bus
// bush
// bushel
// business
// busy
// but
// butcher
// butter
// butterfly
// butterscotch
// button
// buy
// buzz
// by
// bye
// cab
// cabbage
// cabin
// cage
// cake
// calendar
// calf
// call
// came
// camel
// camera
// camp
// can
// can't
// canal
// canary
// candle
// candy
// cane
// cannon
// cannot
// canoe
// canyon
// cap
// cape
// capital
// capsule
// captain
// capture
// car
// card
// cardboard
// care
// careful
// carefully
// careless
// carload
// carpenter
// carpet
// carriage
// carrot
// carry
// cart
// cartoon
// carve
// case
// cash
// cashier
// castle
// cat
// catch
// caterpillar
// catsup
// cattle
// caught
// cause
// cave
// ceiling
// celebrate
// celebration
// cell
// cellar
// cent
// center
// cereal
// certain
// chain
// chair
// chalk
// chalkboard
// champion
// chance
// change
// channel
// chapter
// charge
// charm
// chart
// chase
// chatter
// cheap
// cheat
// check
// checkers
// checkup
// cheek
// cheer
// cheerful
// cheerfully
// cheese
// cheeseburger
// cherry
// chest
// chestnut
// chew
// chick
// chicken
// chief
// child
// childhood
// children
// chili
// chill
// chilly
// chimney
// chimpanzee
// chin
// china
// chip
// chipmunk
// chirp
// chocolate
// choice
// choke
// choose
// chop
// chop-suey
// chorus
// chose
// chosen
// church
// churn
// cigarette
// circle
// circus
// citizen
// city
// clap
// class
// classroom
// claw
// clay
// clean
// cleanser
// clear
// clerk
// clever
// click
// climate
// climb
// clip
// clock
// close
// closet
// cloth
// cloud
// cloudy
// clown
// club
// clubhouse
// coach
// coal
// coast
// coat
// cob
// cobweb
// cocktail
// cocoa
// coconut
// coffee
// coin
// cold
// collar
// collect
// collection
// collector
// college
// color
// colorful
// colt
// column
// comb
// come
// comfort
// comfortable
// comic
// comma
// command
// commercial
// company
// complete
// computer
// concrete
// conductor
// cone
// connect
// contest
// continue
// control
// cook
// cookie
// cooky
// cool
// copy
// cord
// cork
// corn
// corner
// cornmeal
// correct
// cost
// cosy
// cottage
// cotton
// couch
// cough
// could
// couldn't
// count
// counter
// country
// course
// court
// cousin
// cover
// cow
// coward
// cowboy
// cozy
// crab
// crack
// cracker
// cradle
// cranberry
// crank
// crash
// crawl
// crayon
// crazy
// cream
// creature
// creek
// crib
// cricket
// crime
// cripple
// crisp
// croak
// crook
// crop
// cross
// crosswalk
// crossways
// crow
// crowd
// crown
// cruel
// crumb
// crumble
// crush
// crust
// crutch
// cry
// cub
// cup
// cupboard
// cupful
// cure
// curl
// curly
// curtain
// curve
// cushion
// customer
// cute
// daddy
// dady-long-legs
// daily
// dairy
// daisy
// dam
// damage
// damp
// dance
// dandy
// danger
// dangerous
// dare
// dark
// darkness
// darling
// dart
// dash
// date
// daughter
// dawn
// day
// daylight
// daytime
// dead
// deaf
// deal
// dear
// death
// decide
// deck
// deep
// deer
// defend
// delighted
// deliver
// delivery
// den
// dentist
// depend
// deposit
// describe
// desert
// design
// desire
// desk
// destroy
// detective
// detergent
// devil
// dew
// dial
// diamond
// dice
// dictionary
// did
// didn't
// die
// diet
// difference
// differences
// difficult
// difficulty
// dig
// dim
// dime
// dimple
// dine
// ding-dong
// dinner
// dinosaur
// dip
// direct
// direction
// dirt
// dirty
// disagree
// disappear
// discover
// disease
// disgrace
// disgraceful
// dish
// dismiss
// distance
// ditch
// dive
// divide
// do
// dock
// doctor
// dodge
// does
// doesn't
// dog
// doll
// dollar
// dolly
// don't
// done
// donkey
// door
// doorstep
// dope
// dot
// double
// dove
// down
// downstairs
// downtown
// downward
// downwards
// dozen
// drag
// dragon
// drain
// drank
// draw
// dream
// dress
// drew
// drill
// drink
// drip
// drive
// driveway
// drop
// drove
// drown
// drowsy
// drug
// drugstore
// drum
// drunk
// dry
// duck
// duckling
// due
// dug
// dull
// dumb
// dump
// during
// dust
// dusty
// dying
// each
// eager
// eagle
// ear
// earache
// eardrum
// early
// earn
// earnings
// earth
// earthquake
// east
// eastern
// easy
// eat
// eaten
// edge
// education
// egg
// eight
// eighteen
// eighth
// eighty
// either
// el
// elastic
// elbow
// election
// electric
// electricity
// elephant
// elevator
// eleven
// elm
// else
// empty
// encyclopedia
// end
// endless
// enemy
// engine
// engineer
// english
// enjoy
// enjoyment
// enough
// enter
// envelope
// equal
// equator
// erase
// errand
// error
// escape
// evaporate
// even
// evening
// ever
// everlasting
// every
// everybody
// everyday
// everyone
// everything
// everywhere
// evil
// exactly
// example
// excellent
// except
// exchange
// excited
// exciting
// excuse
// exercise
// exit
// expect
// experiment
// explain
// explode
// explore
// explosive
// express
// expressway
// extinguisher
// extra
// eye
// eyeball
// eyebrow
// eyeglass
// eyelash
// eyelid
// eyesight
// fable
// face
// fact
// factory
// fade
// fail
// failure
// faint
// fair
// fairy
// fairyland
// faith
// fake
// fall
// false
// family
// fan
// fancy
// far
// far-off
// faraway
// fare
// farm
// farmer
// farther
// fashion
// fast
// fasten
// fat
// father
// fault
// favor
// favorite
// fear
// feast
// feather
// fed
// feed
// feel
// feet
// fell
// fellow
// felt
// female
// fence
// fern
// festival
// fever
// few
// fib
// fiddle
// field
// fifteen
// fifth
// fifty
// fig
// fight
// figure
// file
// fill
// film
// final
// finally
// find
// fine
// finger
// fingernail
// fingerprint
// fingertip
// finish
// fire
// firefly
// fireplace
// fireproof
// fireworks
// first
// fish
// fist
// fit
// five
// fix
// fizz
// flag
// flame
// flap
// flare
// flash
// flashlight
// flat
// flavor
// flea
// flesh
// flew
// flies
// flight
// flip
// float
// flock
// flood
// floor
// flour
// flow
// flu
// flunk
// flute
// fly
// foam
// fog
// foggy
// fold
// folks
// follow
// fond
// food
// fool
// foolish
// foot
// football
// footpath
// footprint
// footsteps
// for
// force
// forehead
// forest
// forever
// forget
// forgetful
// forgot
// forgotten
// fork
// form
// fort
// fortune
// forty
// forward
// fought
// found
// fountain
// four
// fourteen
// fourth
// fox
// frame
// freckles
// free
// freedom
// freeze
// freight
// fresh
// friend
// friendship
// frighten
// frog
// from
// front
// frost
// frown
// froze
// fruit
// fry
// fudge
// fuel
// full
// fun
// funny
// fur
// furniture
// further
// gallon
// gallop
// gamble
// game
// gang
// gangster
// garage
// garbage
// garden
// gargle
// gas
// gasoline
// gate
// gather
// gauge
// gave
// gay
// geese
// general
// gentle
// gentleman
// gentlemen
// geography
// get
// ghost
// giant
// gift
// giggle
// gill
// giraffe
// girl
// give
// glad
// gladness
// glance
// glare
// glass
// glassware
// glide
// globe
// glory
// glove
// glow
// glue
// goal
// goat
// gobble
// godmother
// gold
// golden
// goldfish
// golf
// gone
// good
// good-by
// goodbye
// goodies
// goodness
// goose
// got
// gotten
// government
// gown
// grab
// grace
// grade
// grain
// grand
// grandchild
// granddaughter
// grandfather
// grandma
// grandmother
// grandpa
// grandson
// grandstand
// grape
// grapefruit
// grass
// grasshopper
// grave
// gravel
// graveyard
// gravy
// gray
// graze
// grease
// greasy
// great
// greedy
// green
// greens
// greet
// grew
// grey
// greyhound
// grill
// grin
// grind
// grip
// grizzly
// groan
// grocery
// groom
// ground
// group
// grow
// growl
// grown-up
// growth
// guard
// guess
// guest
// guide
// guitar
// gum
// gun
// guy
// gym
// h
// habit
// had
// hadn't
// hail
// hair
// hairy
// half
// hall
// hallway
// ham
// hamburger
// hammer
// hamster
// hand
// handful
// handkerchief
// handle
// handmade
// handsome
// handwriting
// hang
// happen
// happiness
// happy
// harbor
// hard
// hardware
// harm
// harmful
// harmless
// harness
// harp
// harvest
// has
// hasn't
// hat
// hatch
// hatchet
// hate
// haul
// have
// haven't
// hawk
// hay
// he
// he'll
// head
// headache
// headline
// headquarters
// heal
// health
// heap
// hear
// heard
// heart
// heat
// heaven
// heavy
// heel
// height
// held
// helicopter
// hell
// hello
// helmet
// help
// helpful
// hen
// her
// herd
// here
// hero
// herself
// hi-fi
// hid
// hidden
// hide
// hide-and-seek
// hideout
// high
// highway
// hike
// hill
// hilly
// him
// himself
// hint
// hip
// hippo
// hire
// his
// history
// hit
// hitch
// hive
// ho
// hobble
// hobby
// hockey
// hoe
// hold
// holdup
// hole
// holiday
// hollow
// holster
// holy
// home
// homerun
// homesick
// homework
// honest
// honey
// honeybee
// honk
// honor
// hood
// hoof
// hook
// hoot
// hop
// hope
// hopscotch
// horn
// horse
// hose
// hospital
// hot
// hotdog
// hotel
// hound
// hour
// house
// housekeeper
// housewife
// how
// howl
// hug
// huge
// hum
// human
// hump
// hundred
// hung
// hunger
// hungry
// hunk
// hunt
// hurricane
// hurry
// hurt
// husband
// hush
// hut
// hymn
// ice
// iceberg
// icy
// idea
// if
// igloo
// imagine
// important
// impossible
// improve
// in
// inch
// indeed
// indoors
// industry
// ink
// inn
// insect
// inside
// inspection
// instead
// intend
// interest
// into
// introduce
// invent
// inventor
// invite
// iron
// is
// island
// isn't
// ivory
// ivy
// jack
// jack-o-lantern
// jacket
// jackpot
// jacks
// jail
// jam
// janitor
// jar
// jaw
// jawbone
// jay
// jaywalker
// jazz
// jeans
// jeep
// jelly
// jerk
// jet
// jewel
// jewelry
// jig
// join
// joke
// jolly
// jot
// journey
// joy
// joyful
// judge
// jug
// juice
// juicy
// jump
// jungle
// junk
// just
// kangaroo
// keep
// kept
// ketchup
// kettle
// key
// kick
// kid
// kidnap
// kill
// kind
// kindergarten
// kindness
// king
// kiss
// kit
// kitchen
// kite
// kitten
// kitty
// knee
// kneel
// knew
// knife
// knight
// knit
// knives
// knob
// knock
// know
// known
// lace
// lad
// ladder
// lady
// laid
// lake
// lamb
// lame
// lamp
// land
// lane
// language
// lantern
// lap
// large
// last
// late
// laugh
// laundry
// law
// lawn
// lawyer
// lay
// lazy
// lead
// leaf
// leak
// lean
// leap
// learn
// leather
// leave
// leaves
// led
// left
// leg
// lemon
// lemonade
// lend
// length
// lens
// leopard
// less
// lesson
// let
// letter
// lettuce
// level
// liar
// liberty
// librarian
// library
// lick
// lid
// lie
// life
// lifeboat
// lifeguard
// lift
// light
// lighthouse
// lightness
// lightning
// like
// lily
// limb
// lime
// line
// linen
// lion
// lip
// lipstick
// liquor
// list
// listen
// litterbug
// little
// live
// liver
// lizard
// load
// loaf
// loan
// loaves
// lobster
// lock
// log
// lollipop
// lone
// lonesome
// long
// look
// loop
// loose
// lord
// lose
// loss
// lost
// lot
// lotion
// loud
// loudspeaker
// love
// low
// lower
// luck
// lucky
// luggage
// lullaby
// lumber
// lump
// lunch
// lung
// luxury
// lying
// ma
// macaroni
// machine
// mad
// made
// magazine
// magic
// magnet
// maid
// mail
// mailman
// major
// majorette
// make
// make-believe
// male
// mama
// man
// manager
// mane
// mange
// manners
// many
// map
// maple
// marble
// march
// mark
// market
// marriage
// marry
// marvelous
// mash
// mask
// master
// match
// mate
// matter
// mattress
// may
// maybe
// mayor
// me
// meadow
// meal
// mean
// meaning
// measure
// meat
// medicine
// meet
// melon
// melt
// member
// memorize
// memory
// men
// mend
// mention
// menu
// meow
// merchant
// mermaid
// merry
// merry-go-round
// mess
// message
// messenger
// met
// metal
// meter
// mice
// microphone
// middle
// midget
// midnight
// midsummer
// might
// mighty
// mile
// milk
// milkshake
// mill
// million
// millionaire
// mind
// mine
// miner
// minister
// mink
// minnow
// mint
// minute
// miracle
// mirror
// misery
// mislay
// misplace
// misprint
// miss
// missile
// misspell
// mist
// mistake
// mister
// misty
// mitt
// mitten
// mix
// mixture
// mob
// model
// modern
// moist
// moisture
// mom
// moment
// money
// monkey
// monster
// month
// moo
// moon
// moonlight
// moose
// mop
// more
// morning
// most
// motel
// moth
// mother
// motion
// motor
// motorcycle
// mountain
// mouse
// mouth
// movable
// move
// moveable
// movie
// much
// mud
// muffin
// mule
// multiplication
// multiply
// mumps
// murder
// museum
// mush
// mushroom
// music
// musical
// musician
// must
// mustard
// mustn't
// my
// myself
// mystery
// nail
// name
// nap
// napkin
// narrow
// nasty
// nation
// nature
// naughty
// navy
// near
// nearby
// neat
// neatness
// necessary
// neck
// necklace
// necktie
// need
// needle
// needn't
// negro
// neighbor
// neighborhood
// neither
// nerve
// nest
// net
// never
// new
// newborn
// newcomer
// news
// newscast
// newspaper
// next
// nibble
// nice
// nickel
// nickname
// night
// nightfall
// nightmare
// nighttime
// nine
// nineteen
// ninety
// ninth
// nipple
// nobody
// nod
// noise
// none
// noodle
// noon
// normal
// north
// northern
// nose
// not
// note
// nothing
// notice
// now
// nowhere
// number
// nurse
// nursery
// nut
// o'clock
// oak
// oar
// oatmeal
// oats
// obey
// ocean
// octopus
// odd
// of
// off
// offer
// office
// often
// oh
// oil
// okay
// old
// on
// once
// one
// one-fourth
// one-way
// oneself
// onion
// only
// onward
// onwards
// open
// operator
// opossum
// or
// orange
// orbit
// orchard
// order
// ordinary
// organ
// orphan
// ostrich
// other
// ouch
// ought
// ounce
// our
// ourselves
// out
// outdoors
// outer
// outlaw
// outline
// outside
// oven
// over
// overalls
// overboard
// overcoat
// overdo
// overdone
// overeat
// overflow
// overhead
// overnight
// overseas
// overtime
// overweight
// owe
// owl
// own
// pack
// package
// pad
// page
// paid
// pail
// pain
// painful
// paint
// pair
// pajamas
// pal
// palace
// pale
// pan
// pancake
// panda
// pants
// papa
// paper
// parade
// pardon
// parent
// park
// parrot
// part
// partner
// partnership
// party
// pass
// passenger
// password
// past
// paste
// pasture
// pat
// patch
// path
// pave
// paw
// pay
// payment
// pea
// peace
// peaceful
// peach
// peacock
// peak
// peanut
// pear
// pearl
// pecan
// peck
// peek
// peel
// peep
// peg
// pen
// pencil
// penguin
// penny
// people
// pep
// pepper
// peppermint
// peppy
// perfume
// perhaps
// period
// permit
// person
// personal
// pest
// pet
// phone
// phonograph
// photo
// photograph
// piano
// pick
// pickle
// picnic
// picture
// pie
// piece
// pig
// pigeon
// pile
// pilgrim
// pill
// pillow
// pilot
// pimple
// pin
// pine
// pineapple
// ping-pong
// pink
// pint
// pioneer
// pipe
// pistol
// pit
// pitch
// pitcher
// pitiful
// pity
// pizza
// place
// plain
// plan
// plane
// planet
// plant
// plantation
// plaster
// plate
// play
// playful
// playground
// playhouse
// playmate
// plaything
// pleasant
// please
// pleasure
// plenty
// plow
// plug
// plum
// plumber
// plus
// pocket
// pocketbook
// poem
// point
// poison
// poke
// pole
// police
// policeman
// polite
// pond
// pony
// poodle
// pool
// poor
// pop
// popcorn
// poppy
// porch
// pork
// pose
// possible
// post
// postage
// postman
// postmark
// postpone
// pot
// potato
// potatoes
// pottery
// pound
// pour
// powder
// power
// powerful
// prairie
// praise
// pray
// prayer
// prepare
// present
// preserver
// president
// press
// pretend
// pretty
// prevent
// price
// primary
// prince
// princess
// print
// prison
// private
// prize
// problem
// program
// promise
// promote
// proof
// property
// protect
// proud
// prove
// prune
// public
// puddle
// puff
// pull
// pump
// pumpkin
// punch
// punish
// pup
// pupil
// puppet
// puppy
// pure
// purple
// purse
// push
// puss
// pussy
// put
// puzzle
// quack
// quarrel
// quart
// quarter
// quarterback
// queen
// queer
// question
// quick
// quickly
// quiet
// quilt
// quit
// quite
// rabbit
// raccoon
// race
// rack
// radio
// radish
// rag
// rail
// railroad
// rain
// rainbow
// raindrop
// rainy
// raise
// raisin
// rake
// ram
// ran
// ranch
// rang
// range
// rascal
// rat
// rate
// rather
// rattle
// rattlesnake
// raw
// ray
// rayon
// razor
// reach
// read
// ready
// real
// really
// rear
// reason
// rebuild
// receive
// recess
// record
// red
// redbird
// redbreast
// reflect
// refresh
// refreshment
// refrigerator
// refuse
// register
// reindeer
// rejoice
// rejoin
// related
// religion
// remain
// remember
// remind
// remove
// rent
// repair
// repay
// repeat
// report
// respect
// rest
// restaurant
// restroom
// retire
// return
// review
// reward
// rhyme
// rib
// ribbon
// rice
// rich
// rid
// riddle
// ride
// right
// rim
// ring
// rip
// ripe
// rise
// river
// road
// roar
// roast
// rob
// robber
// robbery
// robe
// robin
// rock
// rocket
// rocky
// rode
// roll
// roller
// romance
// roof
// room
// rooster
// root
// rope
// rose
// rot
// rotten
// rough
// round
// route
// row
// rowboat
// royal
// rub
// rubber
// rug
// rule
// run
// rung
// rush
// rust
// rusty
// sack
// sad
// saddle
// sadness
// safe
// safety
// said
// sail
// sailboat
// sailor
// saint
// salad
// sale
// salt
// same
// sample
// sand
// sandwich
// sandy
// sang
// sank
// sap
// sat
// satisfactory
// sauce
// saucer
// sausage
// save
// savings
// saw
// sawdust
// say
// scab
// scale
// scalp
// scamper
// scare
// scarecrow
// scarf
// scary
// scatter
// school
// schoolboy
// schoolgirl
// science
// scissors
// scoop
// scooter
// score
// scout
// scrap
// scratch
// scream
// screen
// screw
// scrub
// sea
// seal
// seam
// search
// seashore
// season
// seat
// second
// secret
// see
// seed
// seem
// seen
// seesaw
// selection
// self
// selfish
// sell
// selves
// send
// sense
// sensible
// sent
// sentence
// separate
// servant
// serve
// service
// set
// settle
// seven
// seventeen
// seventh
// seventy
// several
// sew
// shade
// shadow
// shady
// shake
// shall
// shame
// shampoo
// shape
// share
// sharp
// shave
// she
// she'd
// she'll
// sheep
// sheet
// shelf
// shell
// shelves
// shepherd
// shine
// shiny
// ship
// shipment
// shirt
// shock
// shoe
// shoemaker
// shook
// shoot
// shop
// shore
// short
// shortness
// shot
// should
// shoulder
// shouldn't
// shout
// shove
// shovel
// show
// shower
// shown
// shut
// shutter
// shy
// sick
// sickness
// side
// sidewalk
// sigh
// sight
// sign
// silence
// silent
// silk
// sill
// silly
// silver
// simple
// sin
// since
// sing
// single
// sink
// sip
// sister
// sit
// six
// sixteen
// sixth
// sixty
// size
// skate
// ski
// skin
// skip
// skirt
// skunk
// sky
// skyscraper
// slam
// slap
// slave
// sled
// sleep
// sleepy
// sleeve
// sleigh
// slept
// slice
// slid
// slide
// slim
// slip
// slipper
// slippery
// slosh
// slow
// slowly
// sly
// small
// smart
// smash
// smell
// smile
// smog
// smoke
// smoky
// smooth
// snack
// snail
// snake
// snap
// sneeze
// sniff
// snow
// snowball
// snowflake
// snowy
// snug
// soak
// soap
// social
// sock
// soda
// sofa
// soft
// softball
// soil
// sold
// soldier
// solid
// solve
// some
// somebody
// someone
// something
// sometime
// somewhere
// son
// song
// soon
// sore
// sorrow
// sorry
// sort
// soul
// sound
// soup
// sour
// south
// southern
// space
// spaceship
// spade
// spaghetti
// spank
// spark
// sparrow
// speak
// spear
// special
// speck
// speech
// speed
// speedometer
// spell
// spend
// spice
// spider
// spill
// spin
// spirit
// spit
// splash
// split
// spoil
// spoke
// sponge
// spook
// spooky
// spool
// spoon
// sport
// spot
// sprain
// spray
// spread
// spring
// sprinkle
// spy
// square
// squash
// squeak
// squeaky
// squeal
// squeeze
// squirrel
// stab
// stable
// stack
// stage
// stair
// stale
// stalk
// stamp
// stand
// star
// starch
// stare
// start
// starve
// state
// states
// station
// statue
// stay
// steak
// steal
// steam
// steel
// steep
// steeple
// steer
// step
// stepfather
// stepmother
// stereo
// stew
// stick
// sticky
// stiff
// still
// sting
// stink
// stir
// stitch
// stock
// stocking
// stole
// stolen
// stomach
// stone
// stood
// stool
// stoop
// stop
// stoplight
// store
// storeroom
// stork
// storm
// stormy
// story
// storyteller
// stove
// straight
// straighten
// strange
// strap
// straw
// strawberry
// stream
// street
// strength
// stretch
// strike
// string
// strip
// stripe
// strong
// stuck
// student
// studio
// study
// stuff
// stumble
// stung
// stunt
// style
// subject
// submarine
// subtract
// subtraction
// such
// suck
// sudden
// suddenly
// suffer
// sugar
// suit
// sum
// summer
// sun
// sunbeam
// sunburn
// sundown
// sunflower
// sung
// sunk
// sunken
// sunlight
// sunrise
// sunset
// sunshine
// supper
// suppose
// sure
// surface
// surfboard
// surgeon
// surprise
// surround
// surroundings
// suspect
// swallow
// swam
// swamp
// swan
// swear
// sweat
// sweater
// sweep
// sweepstakes
// sweet
// sweeten
// sweetheart
// sweetness
// swell
// swept
// swift
// swim
// swing
// switch
// sword
// syllable
// table
// tablespoon
// tablet
// tack
// taffy
// tail
// tailor
// take
// taken
// tale
// talk
// tall
// tame
// tan
// tangle
// tank
// tap
// tape
// tar
// taste
// tattle
// tattletale
// tattoo
// taught
// tax
// taxpayer
// tea
// teach
// teacher
// team
// teapot
// tear
// tease
// teaspoon
// teeth
// telegram
// telephone
// telescope
// television
// tell
// temper
// temperature
// ten
// tend
// tender
// tennis
// tent
// tenth
// term
// terrible
// test
// than
// thank
// thankful
// that
// that's
// the
// theater
// their
// them
// then
// there
// there's
// thermometer
// these
// they
// they'd
// they'll
// they're
// they've
// thick
// thief
// thin
// thing
// think
// third
// thirst
// thirsty
// thirteen
// thirty
// this
// thorn
// those
// thought
// thoughtful
// thoughtless
// thousand
// thread
// three
// threw
// throat
// throne
// through
// throw
// thrown
// thumb
// thunder
// tick
// tick-tock
// ticket
// tickle
// tiddlywinks
// tie
// tiger
// tight
// till
// timber
// time
// tin
// tinkle
// tiny
// tiptoe
// tire
// tissue
// title
// to
// toad
// toast
// tobacco
// today
// toe
// together
// toilet
// told
// tomato
// tomorrow
// ton
// tone
// tongue
// tonight
// too
// took
// tool
// tooth
// toothbrush
// toothpaste
// top
// tore
// torn
// tornado
// torpedo
// tortoise
// toss
// total
// touch
// toward
// towel
// town
// toy
// trace
// track
// tractor
// trade
// traffic
// trail
// train
// tramp
// trap
// trash
// travel
// tray
// treasure
// tree
// trespass
// trick
// tricycle
// trim
// trip
// trombone
// troop
// trophy
// trouble
// truck
// true
// truly
// trumpet
// trunk
// trust
// truth
// truthful
// try
// tub
// tube
// tug
// tulip
// tumble
// tune
// tunnel
// turkey
// turn
// turnip
// turtle
// twelve
// twenty
// twice
// twig
// twin
// twist
// two
// type
// typewriter
// ugly
// umbrella
// umpire
// uncle
// under
// underline
// undershirt
// understand
// underwear
// undress
// uneducated
// unemployed
// unfair
// unfasten
// unfinished
// unfold
// unfurnished
// unhappy
// uniform
// united
// unkind
// unknown
// unnecessary
// unsafe
// untie
// until
// untrue
// unwilling
// unwise
// unwrap
// up
// upon
// upper
// upset
// upside-down
// upstairs
// uptown
// upward
// us
// use
// useful
// usher
// vacant
// vacation
// valley
// valuable
// value
// vanish
// varnish
// vase
// vegetable
// velvet
// verse
// very
// vessel
// vest
// vice-president
// view
// village
// vine
// violet
// violin
// visit
// visitor
// vitamin
// voice
// volleyball
// vote
// waffle
// wag
// wagon
// waist
// wait
// waiter
// wake
// waken
// walk
// wall
// wallet
// walnut
// wander
// want
// war
// warm
// warmth
// warn
// wart
// was
// wash
// washer
// washroom
// wasn't
// wasp
// waste
// watch
// watchdog
// water
// waterfall
// watermelon
// waterproof
// wave
// wax
// way
// we
// we'll
// we're
// weak
// weaken
// weakness
// wealth
// weapon
// wear
// weather
// weave
// web
// wedding
// wee
// weed
// week
// weekdays
// weekend
// weep
// weigh
// weight
// welcome
// well
// went
// were
// weren't
// west
// western
// wet
// whale
// what
// wheat
// wheel
// wheelbarrow
// when
// where
// where's
// which
// while
// whip
// whirl
// whirlpool
// whirlwind
// whisker
// whisper
// whistle
// white
// whiteness
// who
// who's
// whole
// whom
// whooping
// whose
// why
// wicked
// wide
// wide-awake
// wife
// wigwam
// wild
// wildcat
// wildlife
// will
// willing
// willow
// win
// wind
// window
// windowpane
// windy
// wine
// wing
// wink
// winter
// wipe
// wire
// wise
// wish
// witch
// with
// without
// woke
// wolf
// wolves
// woman
// women
// won
// won't
// wonder
// wonderful
// wood
// woodchuck
// wooden
// woodpecker
// woods
// woof
// wool
// woolen
// word
// wore
// work
// workman
// world
// worm
// worn
// worry
// worse
// worst
// worth
// would
// wouldn't
// wound
// wrap
// wreck
// wren
// wrist
// write
// written
// wrong
// wrote
// x-mas
// x-ray
// yard
// yarn
// yawn
// year
// yell
// yellow
// yellowish
// yes
// yesterday
// yet
// yolk
// yonder
// you
// you'd
// you'll
// young
// youngster
// your
// yourself
// youth
// zebra
// zero
// zone
// zoo
// `);



  // Jargon and buzzword detection
  const jargonWords = [
    "utilize", "leverage", "optimize", "streamline", "synergy",
    "paradigm", "interface", "functionality", "implementation"
  ];
  
  const jargonCount = words.filter(word => 
    jargonWords.includes(word.toLowerCase())
  ).length;
  
  if (jargonCount > 0) {
    score -= jargonCount * 5;
    feedback.push("Replace jargon with simpler alternatives.");
  }

  // Check for extremely long sentences
  if (sentences.some(s => s.split(/\s+/).length > 25)) {
    score -= 5;
    feedback.push("Some sentences are extremely long. Break them up.");
  }

  // Check paragraph length
  if (paragraphs.some(p => p.split(/\s+/).length > 100)) {
    score -= 5;
    feedback.push("Some paragraphs are too long. Keep paragraphs concise.");
  }

  // Check for negative language
  const negativeWords = ['not', 'never', 'no one', 'nobody', 'nothing'];
  if (negativeWords.some(word => text.toLowerCase().includes(word))) {
    score -= 3;
    feedback.push("Consider using positive language instead of negative phrases.");
  }

  // Check for contractions
  const contractions = ["'s", "'re", "'ve", "'ll", "'d", "n't"];
  if (!contractions.some(c => text.includes(c))) {
    score -= 2;
    feedback.push("Consider using contractions to keep writing conversational.");
  }

  // Check for slashes
  if (text.includes('/')) {
    score -= 2;
    feedback.push("Avoid using slashes. Write out 'or' instead.");
  }

  // Readability final adjustments
  // Ensure score stays between 0 and 100
  score = Math.max(0, Math.min(100, score));

  // If no specific feedback, add a generic positive message
  if (feedback.length === 0) {
    feedback.push("Great job! Your text is clear and concise.");
  }

  return {
    score,
    feedback: feedback.join('\n')
  };
}