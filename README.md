
# Introduction
{: #introduction}

In today's digital age, access to information is crucial for participation in society, education, and employment. However, much of the content on the web is written in complex, technical language that creates unnecessary barriers for many readers. This complexity affects not only people with cognitive disabilities or learning differences but also English language learners, individuals with limited literacy, and anyone trying to quickly understand information in high-stress situations.
{: .introduction-text}

My Plain Language Scorer Chrome extension addresses this challenge by providing real-time feedback on text readability. By analyzing factors such as sentence length, complex word usage, passive voice, and technical jargon, the tool helps writers create more accessible content. This project aligns with the Web Content Accessibility Guidelines (WCAG) 3.2.3 recommendation for consistent identification and the broader goal of making web content more understandable for all users. It also provides feedback on most guidelines proposed by [plainlanguage.gov](https://www.plainlanguage.gov/).
{: .introduction-text}

## Analysis Using Positive Disability Principles
{: #Analysis-Using-Positive-Disability-Principles}

### Ableist
{: #Ableist}
The app avoids ableist design by empowering users rather than "fixing"
disability. It gives screen reader users control to adjust page structures according to
their needs, respecting their autonomy and preferences in browsing.

### Accessible
{: #Accessible}
Both the app's interface and its outputs are screen reader compatible,
providing accessible tools and content. While the app is fully functional, future
improvements could include options for real-time user feedback to further align with
diverse accessibility needs.

### Disability-Lead 
{: #Disability-Lead}
Though direct engagement with screen reader users isn’t feasible
within the project timeframe, the app’s design is based on insights from first-person
accounts, ensuring it is informed by the real needs of the community. Later
development phases could bring in direct user feedback.

### Improving Agency
{: #Improving-Agency}
By enabling users to get scores on their plain language, and get feedback on it as well, the gives users the flexibility to write content to meet their unique
needs. Even if a user chooses not to implement a suggested change in the end, they chose changes they prioritized, thus ensuring their agency over content they create.

### Intersectionality
{: #Intersectionality}
This application supports users with intersecting identities by
recognizing that accessibility needs are complex and deeply personal. By providing a
flexible way to check your Plain Language score and get feedback, the app acknowledges that users'
experiences are shaped by multiple, interconnected aspects of identity—such as
disability, race, language, neurodiversity, and socioeconomic background. While making the extension, I have ensured I followed accessibility guidelines for my own work as well. Thus, my approach  aims to transform
accessibility from a standardized solution to a personalized experience that honors the
unique ways diverse users interact with and understand digital information


## Methodology and Results
{: #methodology}

My implementation focused on creating a user-friendly Chrome extension that provides immediate, actionable feedback on text readability. The core functionality includes:

* Text Analysis Engine
  * Sentence length calculation
  * Complex word identification
  * Passive voice detection
  * Technical jargon recognition
{: .methodology-list}

I made the entire extension with Javascript, and made my own scoring algorithm based on gravity of the Plain Language issue. 



## Disability Justice Analysis
{: #disability-Justice-Analysis}

### Intersectionality
{: #Intersectionality}
Intersectionality acknowledges that people with disabilities have unique needs and
experiences based on multiple aspects of their identity, including race, gender,
socioeconomic status, and type of disability. This app is designed with these
intersectional needs in mind by providing a flexible tool for evaluating Plain Language and getting feedback in
ways that meet accessibility requirements. My Chrome extension uses high contrast only, suggestions written in plain language only, and screenreader compatibility, thus taking multiple identities into consideration
while creating the app.

#### For screen reader users with visual impairments
{: #For-screen-reader-users-with-visual-impairments}
It provides screen reader accessibility by having aria tags, and I unsured it worked using NVDA, thus allowing users
to navigate and understand content more easily.

#### For individuals with cognitive disabilities who may struggle with Text or dense writing
{: #For-individuals-with-cognitive-disabilities-who-may-struggle-with-Text}
It offers the option to create Plain language with easy to understand suggestions. The app also has a Clear structures and well-defined sections can reduce
cognitive load, making it easier for users to follow and retain information.
By considering these diverse needs, we avoids a one-size-fits-all approach,
acknowledging that individuals may experience compounded barriers due to both
disability and other intersecting identities, such as non-native English speakers or those
without regular access to disability support resources.

### Commitment to Cross-Disability Solidarity
{: #Commitment-to-Cross-Disability-Solidarity}
Cross-disability solidarity involves designing with a broad spectrum of disabilities in
mind, rather than focusing exclusively on one group. This commitment aligns the app
with the principles of disability justice by creating a tool that can benefit multiple user
groups.

Users with cognitive disabilities  are the primary taget demographic as 
reorganizing content and clarifying jargon and other inaccessible/ unnecessarily difficult language aids in reducing distractions and
enhancing readability. For instance, individuals with ADHD or dyslexia may struggle
with focusing with long sentences, and this app’s ability tohelp write plain Language can
improve focus and comprehension.

Screen reader users with visual impairments are also benefitted from this app,
as they may benefit from easier to understand text, especially when the content is being read to them. 

Individuals with situational limitations (e.g., temporary impairments) could also benefit. 
By building a tool that supports these diverse groups, this app helps foster solidarity
across the disability community, creating a shared resource that can improve digital
accessibility in multiple contexts.

### Leadership of Those Most Impacted
{: #Leadership-of-Those-Most-Impacted}
Disability justice emphasizes centering the voices and leadership of those directly
impacted by accessibility challenges. While ClearPage doesn’t include a full
participatory design process due to time constraints, it draws from the first-person
accounts of people who need Plain Language and existing insights from accessibility advocates.


#### Future development and feedback
{: #Future-development-and-feedback}
Although the project is informed by existing
accounts, I hope for the app to evolve to more closely reflect the community's needs if
developed further. Integrating feedback directly from users—especially
those who regularly encounter poorly structured and hard to understand text—would ensure that the app
functions remain relevant and effective. This potential for growth aligns it with disability
justice principles by inviting the leadership and input of those most impacted by the
technology. While contacting users seems like a time and resource intensive process, I
hope to involve them when I make this application public and hopefully when it gains
traction.
By prioritizing user-informed design, my app works toward a future where screen reader
users’ experiences guide digital accessibility solutions, aligning with the principle of
leadership by those most impacted

## Learnings and Future Work
{: #future-work}

This project revealed the complexity of balancing specific accessibility needs with the flexibility required for different contexts and audiences. We learned that automated tools must provide context and education alongside their recommendations to be truly effective.

Future development could expand the tool's capabilities through:

* Real time feedback
* Integration with content management systems
* Support for additional languages
* LLM implementation for sugesstions in text editing
* Customizable rulesets for different audiences
{: .future-work-list}
