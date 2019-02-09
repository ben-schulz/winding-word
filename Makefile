PWD = `pwd`
TESTPAGE = "$(PWD)/tests/results.html"

BROWSE = firefox -new-tab

SRC_FILES = src/*.js tests/*.js

ENTR = entr
ENTR_FLAGS = -c
NEED_ENTR = "'make watch' requires entr to be installed."

BUILD = "./build.sh"
OUTPUT_PATH = "$(PWD)/app/reader.html"
TEMPLATE_PATH = "$(PWD)/src/reader.html.template"

watch:

	which $(ENTR) || ( echo $(NEED_ENTR) && exit 1 )
	ls $(SRC_FILES) | $(ENTR) $(ENTR_FLAGS) $(BROWSE) $(TESTPAGE)

test:
	$(BROWSE) $(TESTPAGE)

app:
	env OUTPUT_PATH=$(OUTPUT_PATH) TEMPLATE_PATH=$(TEMPLATE_PATH) $(BUILD)
	$(BROWSE) $(OUTPUT_PATH)

.PHONY: watch test app
