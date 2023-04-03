import pyttsx3
engine = pyttsx3.init()
print("rate:", engine.getProperty('rate'))
engine.setProperty('rate', 175)
engine.setProperty('voice', 'com.apple.ttsbundle.Daniel-premium')
engine.say("It’s one small step for man. One giant leap for mankind.")

voices = engine.getProperty('voices')
for voice in voices:
    if voice.languages[0].startswith('en'):
        print("Voice: %s" % voice.name)
        print(" - ID: %s" % voice.id)
        print(" - Languages: %s" % voice.languages)
        print(" - Gender: %s" % voice.gender)
        print(" - Age: %s\n" % voice.age)
engine.runAndWait()