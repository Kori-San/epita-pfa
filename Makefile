# ~ Parameters
DATA_CSV_FOLDER = ./export/data
DATA_TOOLS_FOLDER = ./export/tools

# ~ Mandatory
.PHONY: all help markdown autophony exportation
all: help

# ~ Misc.
help: ## Show this help.
	@grep "##" $(MAKEFILE_LIST) | grep -v "grep" | sed 's/:.*##\s*/:@\t/g' | column -t -s "@"

markdown: ## Show this help but in a markdown styled way. This can be used when updating the Makefile to generate documentation and simplify README.md's 'Make rules' section update.
	@grep "##" $(MAKEFILE_LIST) | grep -v "grep" | sed -E 's/([^:]*):.*##\s*/- ***\1***:@\t/g' | column -t -s "@"

autophony: ## Generate a .PHONY rule for your Makefile using all rules in the Makefile(s).
	@grep -oE "^[a-zA-Z-]*\:" $(MAKEFILE_LIST) | sed "s/://g" | xargs echo ".PHONY:"

# ~ Tools
exportation: ## Export all the data from the CSV found in `./export/data/` into a list of formated Objects.
	@sh -c "$(DATA_TOOLS_FOLDER)/data_export_to_json.sh $(DATA_CSV_FOLDER)"
