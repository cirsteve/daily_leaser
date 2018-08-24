#Restricting Access
This dApp is meant to help run centralized rental services, because of that administrative functions are restricted to the owner of the account. Similarly reservations can only be cancelled by the account that created it.

#Pull Payment
When cancelling a reservation a users refunds are not directly sent to the user, instead the are given a credit which allows them to claim their refund. This prevents a user from locking up availability

#Circuit Breaker
The contract employs a circuit breaker so that if a security issue is identified key functions can be paused.
