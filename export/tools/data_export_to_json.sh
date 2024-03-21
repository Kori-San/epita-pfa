#!/bin/bash

## ~ RC Status
# 0 - All good
# 1 - Wrong usage
# 2 - Problem while using `jq`
# 3 - Problem while using `tail`

## ~ Parameters
# Output folder
DIST_PATH="./dist/data"

# Sea surface files
SEA_SURFACE_FILE="sea-surface-temp.csv"
SEA_SURFACE_JSON="sea_surface_temp.json"

# Carbon dioxide files
CARBON_DIOXIDE_FILE="carbon_dioxide_kaggle.csv"
CARBON_DIOXIDE_JSON="carbon_dioxide.json"

# Ocean acidity files
OCEAN_ACIDITY_FILE="ocean-acidity.csv"
OCEAN_ACIDITY_HAWAII_JSON_FILENAME="ocean_acidity.hawaii.json"
OCEAN_ACIDITY_CANARY_JSON_FILENAME="ocean_acidity.canary.json"
OCEAN_ACIDITY_BERMUDA_JSON_FILENAME="ocean_acidity.bermuda.json"

## ~ Usage check
# Check if directory argument is provided
if [ "${#}" -ne 1 ]; then
  echo "Usage: ${0} <directory>"
  exit 1
fi

if [ ! -d "${1}" ]; then
  echo "Folder does not exist."
  exit 1
fi

## ~ Vars
# Directory containing the CSV files
DIR="${1}"

## ~ Sea surface file
# Convert the sea surface temperature CSV to JSON
USELESS_LINE_NUMBER=$( grep -nP "^[,]+" "${DIR}/${SEA_SURFACE_FILE}" | head -n1 | sed "s/:.*//g" )
if [ -z "${USELESS_LINE_NUMBER}" ]; then
    USELESS_LINE_NUMBER=0
fi

TOTAL_LINE_NUMBER=$( wc -l "${DIR}/${SEA_SURFACE_FILE}" | sed "s/ .*//g" )
TAIL_LINE_NUMBER=$(( TOTAL_LINE_NUMBER - USELESS_LINE_NUMBER - 1 )) # -1 to get rid of columns title

tail -n"${TAIL_LINE_NUMBER}" "${DIR}/${SEA_SURFACE_FILE}" > "${SEA_SURFACE_FILE}.bak" || exit 3

jq -R -s '
split("\n") | map(select(length > 0) | split(",") | {
  year: .[0]|tonumber,
  global_sea_year_anomaly_farenheit: .[1]|tonumber,
  global_sea_year_anomaly_lower_confidence_farenheit: .[2]|tonumber,
  global_sea_year_anomaly_upper_confidence_farenheit: .[3]|tonumber
})' < "${SEA_SURFACE_FILE}.bak" > "${SEA_SURFACE_JSON}" || exit 2

## ~ Carbon dioxide file
# Convert the carbon dioxide CSV to JSON
USELESS_LINE_NUMBER=$( grep -nP "^[,]+" "${DIR}/${CARBON_DIOXIDE_FILE}" | head -n1 | sed "s/:.*//g" )
if [ -z "${USELESS_LINE_NUMBER}" ]; then
    USELESS_LINE_NUMBER=0
fi

TOTAL_LINE_NUMBER=$( wc -l "${DIR}/${CARBON_DIOXIDE_FILE}" | sed "s/ .*//g" )
TAIL_LINE_NUMBER=$(( TOTAL_LINE_NUMBER - USELESS_LINE_NUMBER - 1 )) # -1 to get rid of columns title

tail -n"${TAIL_LINE_NUMBER}" "${DIR}/${CARBON_DIOXIDE_FILE}" > "${CARBON_DIOXIDE_FILE}.bak" || exit 3

jq -R -s '
split("\n") | map(select(length > 0) | split(",") | {
  year: .[0] | tonumber,
  carbon_dioxide_ppm: (if .[3] == "" then null else .[3] | tonumber? end),
  seasonally_adjusted_carbon_dioxide_ppm: (if .[4] == "" then null else .[4] | tonumber? end),
  carbon_dioxide_fit_ppm: (if .[5] == "" then null else .[5] | tonumber? end),
  seasonally_adjusted_carbon_dioxide_fit_ppm: (if .[6] == "" then null else .[6] | tonumber? end)
}) | group_by(.year) | map({
  year: .[0].year,
  carbon_dioxide_ppm: map(.carbon_dioxide_ppm),
  seasonally_adjusted_carbon_dioxide_ppm: map(.seasonally_adjusted_carbon_dioxide_ppm),
  carbon_dioxide_fit_ppm: map(.carbon_dioxide_fit_ppm),
  seasonally_adjusted_carbon_dioxide_fit_ppm: map(.seasonally_adjusted_carbon_dioxide_fit_ppm)
})' < "${CARBON_DIOXIDE_FILE}.bak" > "${CARBON_DIOXIDE_JSON}" || exit 2

## ~ Ocean acidity
# Convert the ocean acidity CSV to JSON
USELESS_LINE_NUMBER=$( grep -nP "^[,]+" "${DIR}/${OCEAN_ACIDITY_FILE}" | head -n1 | sed "s/:.*//g" )
if [ -z "${USELESS_LINE_NUMBER}" ]; then
    USELESS_LINE_NUMBER=0
fi

TOTAL_LINE_NUMBER=$( wc -l "${DIR}/${OCEAN_ACIDITY_FILE}" | sed "s/ .*//g" )
TAIL_LINE_NUMBER=$(( TOTAL_LINE_NUMBER - USELESS_LINE_NUMBER - 1)) # -1 to get rid of columns title

tail -n"${TAIL_LINE_NUMBER}" "${DIR}/${OCEAN_ACIDITY_FILE}" > "${OCEAN_ACIDITY_FILE}.bak" || exit 3

jq -R -s '
  split("\n") | 
  map(select(. != "" and . != null)) | 
  map(split(",") | {
    year: (if .[0] != "" then .[0] | tonumber | floor else empty end),
    hawaii_decimal_year: (if .[0] != "" then .[0] | tonumber else empty end),
    hawaii_ph: (if .[1] != "" then .[1] | tonumber else empty end),
    hawaii_carbon_dioxide: (if .[2] != "" then .[2] | tonumber else empty end),
  }) |
  group_by(.year) | map({
    year: .[0].year,
    hawaii_acidity: map({
        hawaii_decimal_year: .hawaii_decimal_year,
        hawaii_ph: .hawaii_ph,
        hawaii_carbon_dioxide: .hawaii_carbon_dioxide,
    }),
  })' < "${OCEAN_ACIDITY_FILE}.bak" > "${OCEAN_ACIDITY_HAWAII_JSON_FILENAME}" || exit 2

jq -R -s '
  split("\n") | 
  map(select(. != "" and . != null)) | 
  map(split(",") | {
    year: (if .[4] != "" then .[4] | tonumber | floor else empty end),
    canary_decimal_year: (if .[4] != "" then .[4] | tonumber else empty end),
    canary_ph: (if .[5] != "" then .[5] | tonumber else empty end),
    canary_carbon_dioxide: (if .[6] != "" then .[6] | tonumber else empty end),
  }) |
  group_by(.year) | map({
    year: .[0].year,
    canary_acidity: map({
        canary_decimal_year: .canary_decimal_year,
        canary_ph: .canary_ph,
        canary_carbon_dioxide: .canary_carbon_dioxide,
    }),
  })' < "${OCEAN_ACIDITY_FILE}.bak" > "${OCEAN_ACIDITY_CANARY_JSON_FILENAME}" || exit 2

jq -R -s '
  split("\n") | 
  map(select(. != "" and . != null)) | 
  map(split(",") | {
    year: (if .[8] != "" then .[8] | tonumber | floor else empty end),
    bermuda_decimal_year: (if .[8] != "" then .[8] | tonumber else empty end),
    bermuda_ph: (if .[9] != "" then .[9] | tonumber else empty end),
    bermuda_carbon_dioxide: (if .[10] != "" then .[10] | tonumber else empty end),
  }) |
  group_by(.year) | map({
    year: .[0].year,
    bermuda_acidity: map({
        bermuda_decimal_year: .bermuda_decimal_year,
        bermuda_ph: .bermuda_ph,
        bermuda_carbon_dioxide: .bermuda_carbon_dioxide,
    }),
  })' < "${OCEAN_ACIDITY_FILE}.bak" > "${OCEAN_ACIDITY_BERMUDA_JSON_FILENAME}" || exit 2

## ~ Create the final JSON
mkdir -p "${DIST_PATH}"

# Combine all JSON files into the final format
  jq \
    --slurpfile co2 "${CARBON_DIOXIDE_JSON}" \
    --slurpfile sst "${SEA_SURFACE_JSON}" \
    --slurpfile hawaii "${OCEAN_ACIDITY_HAWAII_JSON_FILENAME}" \
    --slurpfile canary "${OCEAN_ACIDITY_CANARY_JSON_FILENAME}" \
    --slurpfile bermuda "${OCEAN_ACIDITY_BERMUDA_JSON_FILENAME}" \
    -n '
    # Combine the lists and create a unique list of ids
    ($co2[0] + $sst[0] + $hawaii[0] + $canary[0] + $bermuda[0] | map(.year) | unique) as $years |
    
    # Iterate over each unique id
    [ $years[] as $year |
        {
        year: $year,

        global_sea_year_anomaly_farenheit: ($sst[0] | map(select(.year == $year)) | first? | .global_sea_year_anomaly_farenheit // null),
        global_sea_year_anomaly_lower_confidence_farenheit: ($sst[0] | map(select(.year == $year)) | first? | .global_sea_year_anomaly_lower_confidence_farenheit // null),
        global_sea_year_anomaly_upper_confidence_farenheit: ($sst[0] | map(select(.year == $year)) | first? | .global_sea_year_anomaly_upper_confidence_farenheit // null),

        carbon_dioxide_ppm: ($co2[0] | map(select(.year == $year)) | first? | .carbon_dioxide_ppm // null),
        seasonally_adjusted_carbon_dioxide_ppm: ($co2[0] | map(select(.year == $year)) | first? | .seasonally_adjusted_carbon_dioxide_ppm // null),
        carbon_dioxide_fit_ppm: ($co2[0] | map(select(.year == $year)) | first? | .carbon_dioxide_fit_ppm // null),
        seasonally_adjusted_carbon_dioxide_fit_ppm: ($co2[0] | map(select(.year == $year)) | first? | .seasonally_adjusted_carbon_dioxide_fit_ppm // null),

        hawaii_acidity: ($hawaii[0] | map(select(.year == $year)) | first? | .hawaii_acidity // null), 
        canary_acidity: ($canary[0] | map(select(.year == $year)) | first? | .canary_acidity // null), 
        bermuda_acidity: ($bermuda[0] | map(select(.year == $year)) | first? | .bermuda_acidity // null), 
        }
    ]
' > "${DIST_PATH}/export.$(date +"%F.%T:%N").json"

# Delete useless files
rm "${SEA_SURFACE_FILE}.bak" "${CARBON_DIOXIDE_FILE}.bak" "${OCEAN_ACIDITY_FILE}.bak"
