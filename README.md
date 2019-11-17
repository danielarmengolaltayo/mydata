Original data schema:

    Entities collection:

        self  Definition for the entity.
              (required input)

      others  List of relationships for this entity.
              (relationship/s id/s)

         _id  Id for this entry in the database.


    Interactions collection:

           a  (entity id)

           b  (entity id)

           c  Context for the interaction between the two entities.
              (optional input)

        date  Creation date.

         _id  Id for this entry in the database.


    Relationships collection:

        list  List of interactions for the same relationship.

         _id  Id for this entry in the database.


Expanded data schema:

    Entities collection:

         totalInt  Total amount of interactions for this entity.


    Interactions collection:

                d  Creation date, shorter version.
                   (YYYY-MM-DD)

                t  Creation time.
                   (HH:MM:SS)

    lastOfTheSame  The last interaction for this particular relationship.
                   (boolean value)

     lastOfTheDay  The last interaction of the day.
                   (boolean value)

            selfA  Definition for the first entity.
                   (value from ent.self)

            selfB  Definition for the second entity.
                   (value from ent.self)

          othersA  List of relationships for the first entity.
                   (value from ent.others)

          othersB  List of relationships for the second entity.
                   (value from ent.others)