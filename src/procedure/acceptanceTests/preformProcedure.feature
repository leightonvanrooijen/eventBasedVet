Feature: Vets can preform procedures

  @procedure
  Scenario: vet preforms a procedure
    Given a vet is preforming a procedure
    When the vet consumes a good
    And the vet completes the procedure
    Then the procedure is completed with the consumed goods on it

  @procedure
  Scenario: Create a new Procedure
    Given the procedure has been created
    When a user begins the procedure
    Then the procedure is began

  @procedure
  Scenario: Consuming goods during procedure
    Given a vet is preforming a procedure
    When a user consumes a good during a procedure
    Then the good is consumed

