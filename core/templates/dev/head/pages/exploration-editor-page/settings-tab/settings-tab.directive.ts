// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directive for the exploration settings tab.
 */

require(
  'components/forms/custom-forms-directives/select2-dropdown.directive.ts');
require(
  'pages/exploration-editor-page/exploration-title-editor/' +
  'exploration-title-editor.directive.ts');
require(
  'pages/exploration-editor-page/exploration-objective-editor/' +
  'exploration-objective-editor.directive.ts');
require(
  'pages/exploration-editor-page/param-changes-editor/' +
  'param-changes-editor.directive.ts');

require('domain/exploration/EditableExplorationBackendApiService.ts');
require('domain/utilities/UrlInterpolationService.ts');
require('pages/exploration-editor-page/services/change-list.service.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-automatic-text-to-speech.service.ts');
require(
  'pages/exploration-editor-page/services/exploration-category.service.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-correctness-feedback.service.ts');
require('pages/exploration-editor-page/services/exploration-data.service.ts');
require('pages/exploration-editor-page/exploration-editor-page.controller.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-init-state-name.service.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-language-code.service.ts');
require(
  'pages/exploration-editor-page/services/exploration-objective.service.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-param-changes.service.ts');
require(
  'pages/exploration-editor-page/services/exploration-param-specs.service.ts');
require('pages/exploration-editor-page/services/exploration-rights.service.ts');
require('pages/exploration-editor-page/services/exploration-states.service.ts');
require('pages/exploration-editor-page/services/exploration-tags.service.ts');
require('pages/exploration-editor-page/services/exploration-title.service.ts');
require(
  'pages/exploration-editor-page/services/exploration-warnings.service.ts');
require(
  'pages/exploration-editor-page/services/user-email-preferences.service.ts');
require('services/AlertsService.ts');
require('services/EditabilityService.ts');
require('services/ExplorationFeaturesService.ts');

require('pages/exploration-editor-page/exploration-editor-page.constants.ts');

var oppia = require('AppInit.ts').module;

oppia.directive('settingsTab', ['UrlInterpolationService', function(
    UrlInterpolationService) {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      currentUserIsAdmin: '=',
      currentUserIsModerator: '='
    },
    templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
      '/pages/exploration-editor-page/settings-tab/' +
      'settings-tab.directive.html'),
    controllerAs: '$ctrl',
    controller: [
      '$http', '$rootScope', '$scope', '$uibModal', '$window', 'AlertsService',
      'ChangeListService', 'EditableExplorationBackendApiService',
      'EditabilityService', 'ExplorationAutomaticTextToSpeechService',
      'ExplorationCategoryService', 'ExplorationCorrectnessFeedbackService',
      'ExplorationDataService', 'ExplorationFeaturesService',
      'ExplorationInitStateNameService', 'ExplorationLanguageCodeService',
      'ExplorationObjectiveService', 'ExplorationParamChangesService',
      'ExplorationParamSpecsService', 'ExplorationRightsService',
      'ExplorationStatesService', 'ExplorationTagsService',
      'ExplorationTitleService', 'ExplorationWarningsService',
      'UrlInterpolationService', 'UserEmailPreferencesService',
      'ALL_CATEGORIES', 'EXPLORATION_TITLE_INPUT_FOCUS_LABEL',
      function(
          $http, $rootScope, $scope, $uibModal, $window, AlertsService,
          ChangeListService, EditableExplorationBackendApiService,
          EditabilityService, ExplorationAutomaticTextToSpeechService,
          ExplorationCategoryService, ExplorationCorrectnessFeedbackService,
          ExplorationDataService, ExplorationFeaturesService,
          ExplorationInitStateNameService, ExplorationLanguageCodeService,
          ExplorationObjectiveService, ExplorationParamChangesService,
          ExplorationParamSpecsService, ExplorationRightsService,
          ExplorationStatesService, ExplorationTagsService,
          ExplorationTitleService, ExplorationWarningsService,
          UrlInterpolationService, UserEmailPreferencesService,
          ALL_CATEGORIES, EXPLORATION_TITLE_INPUT_FOCUS_LABEL) {
        var ctrl = this;
        ctrl.EXPLORATION_TITLE_INPUT_FOCUS_LABEL = (
          EXPLORATION_TITLE_INPUT_FOCUS_LABEL);
        ctrl.EditabilityService = EditabilityService;
        ctrl.CATEGORY_LIST_FOR_SELECT2 = [];
        for (var i = 0; i < ALL_CATEGORIES.length; i++) {
          ctrl.CATEGORY_LIST_FOR_SELECT2.push({
            id: ALL_CATEGORIES[i],
            text: ALL_CATEGORIES[i]
          });
        }

        ctrl.isRolesFormOpen = false;

        ctrl.TAG_REGEX = constants.TAG_REGEX;
        ctrl.canDelete = GLOBALS.canDelete;
        ctrl.canModifyRoles = GLOBALS.canModifyRoles;
        ctrl.canReleaseOwnership = GLOBALS.canReleaseOwnership;
        ctrl.canUnpublish = GLOBALS.canUnpublish;
        ctrl.explorationId = ExplorationDataService.explorationId;

        var CREATOR_DASHBOARD_PAGE_URL = '/creator_dashboard';
        var EXPLORE_PAGE_PREFIX = '/explore/';

        ctrl.getExplorePageUrl = function() {
          return (
            window.location.protocol + '//' + window.location.host +
            EXPLORE_PAGE_PREFIX + ctrl.explorationId);
        };

        ctrl.initSettingsTab = function() {
          ctrl.explorationTitleService = ExplorationTitleService;
          ctrl.explorationCategoryService = ExplorationCategoryService;
          ctrl.explorationObjectiveService = ExplorationObjectiveService;
          ctrl.explorationLanguageCodeService = ExplorationLanguageCodeService;
          ctrl.explorationTagsService = ExplorationTagsService;
          ctrl.ExplorationRightsService = ExplorationRightsService;
          ctrl.explorationInitStateNameService = (
            ExplorationInitStateNameService);
          ctrl.explorationParamSpecsService = ExplorationParamSpecsService;
          ctrl.explorationParamChangesService = ExplorationParamChangesService;
          ctrl.UserEmailPreferencesService = UserEmailPreferencesService;

          ExplorationDataService.getData().then(function() {
            ctrl.refreshSettingsTab();
            ctrl.hasPageLoaded = true;
          });
        };

        ctrl.refreshSettingsTab = function() {
          // Ensure that ExplorationStatesService has been initialized before
          // getting the state names from it. (Otherwise, navigating to the
          // settings tab directly (by entering a URL that ends with /settings)
          // results in a console error.
          if (ExplorationStatesService.isInitialized()) {
            var categoryIsInSelect2 = ctrl.CATEGORY_LIST_FOR_SELECT2.some(
              function(categoryItem) {
                return (
                  categoryItem.id === ExplorationCategoryService.savedMemento);
              }
            );

            // If the current category is not in the dropdown, add it
            // as the first option.
            if (!categoryIsInSelect2 &&
                ExplorationCategoryService.savedMemento) {
              ctrl.CATEGORY_LIST_FOR_SELECT2.unshift({
                id: ExplorationCategoryService.savedMemento,
                text: ExplorationCategoryService.savedMemento
              });
            }

            ctrl.stateNames = ExplorationStatesService.getStateNames();
          }
        };

        $scope.$on('refreshSettingsTab', ctrl.refreshSettingsTab);

        ctrl.initSettingsTab();

        ctrl.ROLES = [{
          name: 'Manager (can edit permissions)',
          value: 'owner'
        }, {
          name: 'Collaborator (can make changes)',
          value: 'editor'
        }, {
          name: 'Voice Artist (can do voiceover)',
          value: 'voice artist'
        }, {
          name: 'Playtester (can give feedback)',
          value: 'viewer'
        }];

        ctrl.formStyle = {
          display: 'table-cell',
          width: '16.66666667%',
          'vertical-align': 'top'
        };

        ctrl.saveExplorationTitle = function() {
          ExplorationTitleService.saveDisplayedValue();
        };

        ctrl.saveExplorationCategory = function() {
          ExplorationCategoryService.saveDisplayedValue();
        };

        ctrl.saveExplorationObjective = function() {
          ExplorationObjectiveService.saveDisplayedValue();
        };

        ctrl.saveExplorationLanguageCode = function() {
          ExplorationLanguageCodeService.saveDisplayedValue();
        };

        ctrl.saveExplorationTags = function() {
          ExplorationTagsService.saveDisplayedValue();
        };

        ctrl.saveExplorationInitStateName = function() {
          var newInitStateName = ExplorationInitStateNameService.displayed;

          if (!ExplorationStatesService.getState(newInitStateName)) {
            AlertsService.addWarning(
              'Invalid initial state name: ' + newInitStateName);
            ExplorationInitStateNameService.restoreFromMemento();
            return;
          }

          ExplorationInitStateNameService.saveDisplayedValue();

          $rootScope.$broadcast('refreshGraph');
        };

        ctrl.postSaveParamChangesHook = function() {
          ExplorationWarningsService.updateWarnings();
        };

        // Methods for enabling advanced features.
        ctrl.areParametersEnabled =
          ExplorationFeaturesService.areParametersEnabled;
        ctrl.enableParameters = ExplorationFeaturesService.enableParameters;

        ctrl.isAutomaticTextToSpeechEnabled = (
          ExplorationAutomaticTextToSpeechService
            .isAutomaticTextToSpeechEnabled);
        ctrl.toggleAutomaticTextToSpeech = (
          ExplorationAutomaticTextToSpeechService.toggleAutomaticTextToSpeech);

        ctrl.isCorrectnessFeedbackEnabled = (
          ExplorationCorrectnessFeedbackService.isEnabled);
        ctrl.toggleCorrectnessFeedback = (
          ExplorationCorrectnessFeedbackService.toggleCorrectnessFeedback);

        // Methods for rights management.
        ctrl.openEditRolesForm = function() {
          ctrl.isRolesFormOpen = true;
          ctrl.newMemberUsername = '';
          ctrl.newMemberRole = ctrl.ROLES[0];
        };

        ctrl.closeEditRolesForm = function() {
          ctrl.newMemberUsername = '';
          ctrl.newMemberRole = ctrl.ROLES[0];
          ctrl.closeRolesForm();
        };

        ctrl.editRole = function(newMemberUsername, newMemberRole) {
          ctrl.closeRolesForm();
          ExplorationRightsService.saveRoleChanges(
            newMemberUsername, newMemberRole);
        };

        ctrl.toggleViewabilityIfPrivate = function() {
          ExplorationRightsService.setViewability(
            !ExplorationRightsService.viewableIfPrivate());
        };

        // Methods for muting notifications.
        ctrl.muteFeedbackNotifications = function() {
          UserEmailPreferencesService.setFeedbackNotificationPreferences(true);
        };
        ctrl.muteSuggestionNotifications = function() {
          UserEmailPreferencesService.setSuggestionNotificationPreferences(
            true);
        };

        ctrl.unmuteFeedbackNotifications = function() {
          UserEmailPreferencesService.setFeedbackNotificationPreferences(false);
        };
        ctrl.unmuteSuggestionNotifications = function() {
          UserEmailPreferencesService.setSuggestionNotificationPreferences(
            false);
        };

        // Methods relating to control buttons.
        ctrl.previewSummaryTile = function() {
          AlertsService.clearWarnings();
          $uibModal.open({
            templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
              '/pages/exploration-editor-page/settings-tab/templates/' +
              'preview-summary-tile-modal.template.html'),
            backdrop: true,
            controller: [
              '$scope', '$uibModalInstance', function(
                  $scope, $uibModalInstance) {
                $scope.getExplorationTitle = function() {
                  return ExplorationTitleService.displayed;
                };
                $scope.getExplorationObjective = function() {
                  return ExplorationObjectiveService.displayed;
                };
                $scope.getExplorationCategory = function() {
                  return ExplorationCategoryService.displayed;
                };
                $scope.getThumbnailIconUrl = function() {
                  var category = ExplorationCategoryService.displayed;
                  if (constants.ALL_CATEGORIES.indexOf(category) === -1) {
                    category = constants.DEFAULT_CATEGORY_ICON;
                  }
                  return '/subjects/' + category + '.svg';
                };
                $scope.getThumbnailBgColor = function() {
                  var category = ExplorationCategoryService.displayed;
                  var color = null;
                  if (!constants.CATEGORIES_TO_COLORS.hasOwnProperty(
                    category)) {
                    color = constants.DEFAULT_COLOR;
                  } else {
                    color = constants.CATEGORIES_TO_COLORS[category];
                  }
                  return color;
                };

                $scope.close = function() {
                  $uibModalInstance.dismiss();
                  AlertsService.clearWarnings();
                };
              }
            ]
          });
        };

        ctrl.showTransferExplorationOwnershipModal = function() {
          AlertsService.clearWarnings();
          $uibModal.open({
            templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
              '/pages/exploration-editor-page/settings-tab/templates/' +
              'transfer-exploration-ownership-modal.template.html'),
            backdrop: true,
            controller: [
              '$scope', '$uibModalInstance', function(
                  $scope, $uibModalInstance) {
                $scope.transfer = $uibModalInstance.close;

                $scope.cancel = function() {
                  $uibModalInstance.dismiss('cancel');
                  AlertsService.clearWarnings();
                };
              }
            ]
          }).result.then(function() {
            ExplorationRightsService.makeCommunityOwned();
          });
        };

        ctrl.deleteExploration = function() {
          AlertsService.clearWarnings();

          $uibModal.open({
            templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
              '/pages/exploration-editor-page/settings-tab/templates/' +
              'delete-exploration-modal.template.html'),
            backdrop: true,
            controller: [
              '$scope', '$uibModalInstance', function(
                  $scope, $uibModalInstance) {
                $scope.reallyDelete = $uibModalInstance.close;

                $scope.cancel = function() {
                  $uibModalInstance.dismiss('cancel');
                  AlertsService.clearWarnings();
                };
              }
            ]
          }).result.then(function() {
            EditableExplorationBackendApiService.deleteExploration(
              ctrl.explorationId).then(function() {
              $window.location = CREATOR_DASHBOARD_PAGE_URL;
            });
          });
        };

        ctrl.unpublishExplorationAsModerator = function() {
          AlertsService.clearWarnings();

          var moderatorEmailDraftUrl = '/moderatorhandler/email_draft';

          $http.get(moderatorEmailDraftUrl).then(function(response) {
            // If the draft email body is empty, email functionality will not be
            // exposed to the mdoerator.
            var draftEmailBody = response.data.draft_email_body;

            $uibModal.open({
              bindToController: {},
              templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                '/pages/exploration-editor-page/settings-tab/templates/' +
                'moderator-unpublish-exploration-modal.template.html'),
              backdrop: true,
              resolve: {
                draftEmailBody: function() {
                  return draftEmailBody;
                }
              },
              controllerAs: '$ctrl',
              controller: [
                '$uibModalInstance', 'draftEmailBody',
                function($uibModalInstance, draftEmailBody) {
                  var ctrl = this;
                  ctrl.willEmailBeSent = Boolean(draftEmailBody);
                  ctrl.emailBody = draftEmailBody;

                  if (ctrl.willEmailBeSent) {
                    ctrl.EMAIL_BODY_SCHEMA = {
                      type: 'unicode',
                      ui_config: {
                        rows: 20
                      }
                    };
                  }

                  ctrl.reallyTakeAction = function() {
                    $uibModalInstance.close({
                      emailBody: ctrl.emailBody
                    });
                  };

                  ctrl.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                    AlertsService.clearWarnings();
                  };
                }
              ]
            }).result.then(function(result) {
              ExplorationRightsService.saveModeratorChangeToBackend(
                result.emailBody);
            });
          });
        };

        ctrl.isExplorationLockedForEditing = function() {
          return ChangeListService.isExplorationLockedForEditing();
        };

        ctrl.closeRolesForm = function() {
          ctrl.isRolesFormOpen = false;
        };

        ctrl.isTitlePresent = function() {
          return ExplorationTitleService.savedMemento.length > 0;
        };
      }
    ]};
}]);
