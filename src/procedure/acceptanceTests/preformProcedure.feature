Feature: Vets can preform procedures

  @acceptance
  Scenario: vet preforms a procedure
    Given a vet is preforming a procedure
    When the vet consumes a good
    And the vet completes the procedure
    Then the procedure is completed with the consumed goods on it

  @acceptance
  Scenario: Create a new Procedure
    When a user begins a procedure
    Then a procedure is began

  @acceptance
  Scenario: Consuming goods during procedure
    When a user consumes a good during a procedure
    Then the good is consumed

