Feature: Consuming goods

  @acceptance
  Scenario: Consuming goods during procedure
    When a user consumes a good during a procedure
    Then the good is consumed