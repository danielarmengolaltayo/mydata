ref https://github.com/browserify/browserify


# data

## raw

### entities

| key    | description                                                 |
| ------ | ----------------------------------------------------------- |
| self   | required input that defines the entity                      |
| others | list of relationships for this entity                       |
| _id    | id for this entry in the database (automatically generated) |
| __v    | version control mongoDB (automatically generated)           |

### interactions

| key  | description                                                   |
| ---- | ------------------------------------------------------------- |
| a    | entity id                                                     |
| b    | entity id                                                     |
| c    | optional input to define the interaction between two entities |
| date | creation date                                                 |
| _id  | id for this entry in the database (automatically generated)   |
| __v  | version control mongoDB (automatically generated)             |

### relationships

| key  | description                                                   |
| ---- | ------------------------------------------------------------- |
| list | list of interactions for the same relationship                |
| _id  | id for this entry in the database (automatically generated)   |
| __v  | version control mongoDB (automatically generated)             |


## expanded

### entities

| key      | description                                  |
| -------- | -------------------------------------------- |
| totalInt | total amount of interactions for this entity |


### interactions

| key           | description                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| d             | date, short version taken from creation date                                                                     |
| t             | time expressed by hours, minutes and seconds taken from creation date                                            |
| lastOfTheSame | boolean value (true or false) to indicate that this interaction is the last one for this particular relationship |
| lastOfTheDay  | boolean value (true or false) to indicate that this interaction is the last one of the day                       |
| selfA         | value stored at ent.self for the first entity                                                                    |
| selfB         | value stored at ent.self for the second entity                                                                   |
| othersA       | values stored at ent.others for the first entity                                                                 |
| othersB       | values stored at ent.others for the second entity                                                                |
