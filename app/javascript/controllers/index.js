// Import and register all your controllers from the importmap via controllers/**/*_controller
import { application } from "controllers/stimulus_app"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading"

eagerLoadControllersFrom("controllers", application)